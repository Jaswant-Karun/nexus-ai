import 'dart:convert';

import 'package:http/http.dart' as http;

import '../config/api_config.dart';

class ChatService {
  ChatService({http.Client? client}) : _client = client ?? http.Client();

  final http.Client _client;

  Future<void> streamNexusMessage({
    required String message,
    required String sessionId,
    required List<Map<String, String>> history,
    required void Function(Map<String, dynamic> event) onEvent,
  }) async {
    final request =
        http.Request('POST', Uri.parse(ApiConfig.nexusAgentStreamUrl))
          ..headers['Content-Type'] = 'application/json'
          ..body = jsonEncode({
            'message': message,
            'session_id': sessionId,
            'history': history,
            'model': 'auto',
            'reflect': true,
          });

    final response = await _client.send(request);
    if (response.statusCode < 200 || response.statusCode >= 300) {
      final body = await response.stream.bytesToString();
      throw Exception(
          'Nexus Agent returned HTTP ${response.statusCode}: $body');
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
    final data = rawEvent
        .split('\n')
        .where((line) => line.startsWith('data:'))
        .map((line) => line.substring(5).trim())
        .join('\n');
    if (data.isEmpty) return;
    try {
      final decoded = jsonDecode(data);
      if (decoded is Map<String, dynamic>) onEvent(decoded);
    } on FormatException {
      // Ignore incomplete or malformed SSE frames and keep the stream alive.
    }
  }

  void dispose() => _client.close();
}
