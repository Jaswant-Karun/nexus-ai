import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';
import '../core/local_ml_engine.dart';

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
      ..headers['Authorization'] = 'Bearer nx_live_mobile_client'
      ..body = jsonEncode({
        'message': message,
        'session_id': sessionId,
        'history': history,
        'model': 'llama3.2',
      });

    final response = await _client.send(request).timeout(const Duration(seconds: 15));
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

  /// Send message with live thinking steps, token deltas, and zero API keys.
  /// Falls back smoothly to on-device LocalMlEngine if server is unreachable.
  Future<String> sendMessage({
    required String message,
    required String sessionId,
    List<Map<String, String>> history = const [],
    void Function(List<String> steps)? onThinking,
    void Function(String delta)? onDelta,
    void Function(String source)? onSourceResolved,
  }) async {
    final StringBuffer fullResponse = StringBuffer();

    // 1. Primary: Next.js NEXUS Agent local stream over LAN/Host
    try {
      await streamNexusMessage(
        message: message,
        sessionId: sessionId,
        history: history,
        onEvent: (event) {
          final type = event['type'];
          if (type == 'thinking' && event['steps'] is List) {
            final steps = (event['steps'] as List).map((s) => s.toString()).toList();
            if (steps.isNotEmpty) {
              onThinking?.call(steps);
            }
          } else if (type == 'delta' && event['content'] is String) {
            final delta = event['content'] as String;
            fullResponse.write(delta);
            onDelta?.call(delta);
          } else if (type == 'done') {
            if (fullResponse.isEmpty && event['reflection'] is String) {
              final refl = event['reflection'] as String;
              fullResponse.write(refl);
              onDelta?.call(refl);
            }
          }
        },
      );

      final result = fullResponse.toString().trim();
      if (result.isNotEmpty) {
        onSourceResolved?.call('Llama 3.2 (Server Live)');
        return result;
      }
    } catch (_) {
      // Continue to local Ollama fallback if available
    }

    // 2. Direct Ollama fallback if stream connection had an issue
    try {
      final ollamaUri = Uri.parse(ApiConfig.ollamaChatUrl);
      final res = await _client.post(
        ollamaUri,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'model': 'llama3.2',
          'messages': [
            {
              'role': 'system',
              'content': 'You are NEXUS AI, an offline intelligence assistant. Provide a well-structured markdown response.'
            },
            {'role': 'user', 'content': message},
          ],
          'stream': false,
        }),
      ).timeout(const Duration(seconds: 15));

      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        final content = data['message']?['content']?.toString();
        if (content != null && content.trim().isNotEmpty) {
          final text = content.trim();
          onDelta?.call(text);
          onSourceResolved?.call('Ollama Llama 3.2');
          return text;
        }
      }
    } catch (_) {
      // Fall through to on-device ML engine
    }

    // 3. Robust On-Device Machine Learning Engine (100% Offline • Zero Network Required)
    onSourceResolved?.call('On-Device ML-Core (Offline)');
    final mlResult = LocalMlEngine.infer(message);

    // Emit real reasoning steps
    onThinking?.call(mlResult.reasoningSteps);

    // Simulate smooth neural token delivery
    final words = mlResult.response.split(' ');
    for (var i = 0; i < words.length; i += 3) {
      final chunkEnd = (i + 3 < words.length) ? i + 3 : words.length;
      final chunk = words.sublist(i, chunkEnd).join(' ') + (chunkEnd < words.length ? ' ' : '');
      onDelta?.call(chunk);
      await Future.delayed(const Duration(milliseconds: 14));
    }

    return mlResult.response;
  }

  void dispose() => _client.close();
}
