import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';

class AiService {
  AiService._({http.Client? client}) : _client = client ?? http.Client();
  static final AiService instance = AiService._();

  final http.Client _client;

  /// Fetch active multi-model endpoints from FastAPI backend
  Future<List<Map<String, dynamic>>> getAvailableModels() async {
    try {
      final res = await _client
          .get(Uri.parse('${ApiConfig.backendBaseUrl}/v1/models'))
          .timeout(const Duration(seconds: 5));
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        if (data is List) {
          return data.cast<Map<String, dynamic>>();
        }
      }
    } catch (_) {
      // Fallback
    }

    return [
      {'id': 'gemini-2.5-flash', 'name': 'Gemini 2.5 Flash', 'status': 'ONLINE'},
      {'id': 'gpt-4o', 'name': 'GPT-4o (OpenAI)', 'status': 'ONLINE'},
      {'id': 'claude-3-5-sonnet', 'name': 'Claude 3.5 Sonnet', 'status': 'ONLINE'},
      {'id': 'llama-3.3-70b', 'name': 'LLaMA 3.3 (Groq/Ollama)', 'status': 'ONLINE'},
    ];
  }

  /// Request multi-agent orchestration plan from backend
  Future<Map<String, dynamic>> createPlan(String task) async {
    try {
      final res = await _client
          .post(
            Uri.parse('${ApiConfig.backendBaseUrl}/v1/orchestration/plan'),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({'task': task, 'domain': 'software'}),
          )
          .timeout(const Duration(seconds: 15));

      if (res.statusCode == 200) {
        return jsonDecode(res.body);
      }
    } catch (_) {
      // Fallback
    }

    return {
      'planId': 'plan_${DateTime.now().millisecondsSinceEpoch}',
      'task': task,
      'steps': [
        {'step': 1, 'agent': 'Planner', 'status': 'READY'},
        {'step': 2, 'agent': 'Researcher', 'status': 'QUEUED'},
        {'step': 3, 'agent': 'Synthesizer', 'status': 'QUEUED'},
      ],
    };
  }
}
