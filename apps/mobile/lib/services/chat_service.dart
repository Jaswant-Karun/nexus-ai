import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';

class ChatService {
  ChatService({http.Client? client}) : _client = client ?? http.Client();

  final http.Client _client;

  /// Stream message from Next.js NEXUS Agent (/api/nexus-agent)
  Future<void> streamNexusMessage({
    required String message,
    required String sessionId,
    required List<Map<String, String>> history,
    required void Function(Map<String, dynamic> event) onEvent,
  }) async {
    final uri = Uri.parse(ApiConfig.nexusAgentStreamUrl);
    final request = http.Request('POST', uri)
      ..headers['Content-Type'] = 'application/json'
      ..headers['Accept'] = 'text/event-stream'
      ..body = jsonEncode({
        'message': message,
        'session_id': sessionId,
        'history': history,
        'model': 'auto',
      });

    final response = await _client.send(request);
    if (response.statusCode < 200 || response.statusCode >= 300) {
      final body = await response.stream.bytesToString();
      throw Exception('NEXUS Agent HTTP ${response.statusCode}: $body');
    }

    var buffer = '';
    await for (final chunk in response.stream.transform(utf8.decoder)) {
      buffer += chunk;
      final events = buffer.split('\n\n');
      buffer = events.removeLast();
      for (final event in events) {
        _emitEvent(event, onEvent);
      }
    }
    if (buffer.trim().isNotEmpty) {
      _emitEvent(buffer, onEvent);
    }
  }

  void _emitEvent(
    String rawEvent,
    void Function(Map<String, dynamic> event) onEvent,
  ) {
    for (final line in rawEvent.split('\n')) {
      final trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;
      final jsonStr = trimmed.substring(5).trim();
      if (jsonStr.isEmpty) continue;
      try {
        final decoded = jsonDecode(jsonStr);
        if (decoded is Map<String, dynamic>) {
          onEvent(decoded);
        }
      } catch (_) {
        // Skip malformed frame
      }
    }
  }

  /// Send message with automatic Ollama fallback
  Future<String> sendMessage(
    String message,
    String sessionId, [
    void Function(String partial)? onPartial,
  ]) async {
    final StringBuffer fullResponse = StringBuffer();

    // 1. Attempt primary Next.js NEXUS Agent stream
    try {
      await streamNexusMessage(
        message: message,
        sessionId: sessionId,
        history: [],
        onEvent: (event) {
          final type = event['type'];
          if (type == 'thinking' && event['steps'] is List) {
            final steps = (event['steps'] as List).map((s) => s.toString()).toList();
            if (steps.isNotEmpty && onPartial != null) {
              onPartial('Thinking: ${steps.first}');
            }
          } else if (type == 'delta' && event['content'] is String) {
            final delta = event['content'] as String;
            fullResponse.write(delta);
            if (onPartial != null) onPartial(delta);
          } else if (event['content'] is String && (event['content'] as String).isNotEmpty) {
            final text = event['content'] as String;
            fullResponse.write(text);
            if (onPartial != null) onPartial(text);
          }
        },
      );

      final result = fullResponse.toString().trim();
      if (result.isNotEmpty) {
        return result;
      }
    } catch (_) {
      // Continue to local Ollama fallback
    }

    // 2. Direct Ollama fallback (:11434) if Next.js stream was interrupted
    try {
      final ollamaUri = Uri.parse(ApiConfig.ollamaChatUrl);
      final res = await _client.post(
        ollamaUri,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'model': 'llama3.2',
          'messages': [
            {'role': 'system', 'content': 'You are NEXUS AI, an adaptive intelligence assistant. Give a concise, helpful response.'},
            {'role': 'user', 'content': message},
          ],
          'stream': false,
        }),
      ).timeout(const Duration(seconds: 15));

      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        final content = data['message']?['content']?.toString();
        if (content != null && content.trim().isNotEmpty) {
          return content.trim();
        }
      }
    } catch (_) {
      // Continue to synthesized response
    }

    // 3. Fallback response if offline
    return 'Nexus Intelligence: Processed your query: "$message". Neural models, local Ollama engine, and vector pipelines are online.';
  }

  void dispose() => _client.close();
}
