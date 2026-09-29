import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;

class ApiConfig {
  const ApiConfig._();

  // Central Backend API (FastAPI) on port 8000
  static const String _rawBackendUrl = String.fromEnvironment(
    'NEXUS_BACKEND_URL',
    defaultValue: 'http://localhost:8000',
  );

  // Full-Stack Web API Gateway (Next.js) on port 3000
  static const String _rawWebApiUrl = String.fromEnvironment(
    'NEXUS_WEB_API_URL',
    defaultValue: 'http://localhost:3000',
  );

  /// Resolves `localhost` to `10.0.2.2` when running inside the Android Emulator.
  static String _resolveHost(String url) {
    if (!kIsWeb && Platform.isAndroid) {
      return url.replaceAll('http://localhost', 'http://10.0.2.2')
                .replaceAll('http://127.0.0.1', 'http://10.0.2.2');
    }
    return url;
  }

  static String get backendBaseUrl => _resolveHost(_rawBackendUrl);
  static String get webApiBaseUrl => _resolveHost(_rawWebApiUrl);

  // Auth & Token endpoints
  static String get loginUrl => '$webApiBaseUrl/api/auth/login';
  static String get registerUrl => '$webApiBaseUrl/api/auth/register';
  static String get tokensUrl => '$webApiBaseUrl/api/tokens';
  static String get backendTokensUrl => '$backendBaseUrl/v1/tokens';

  // AI & Workflows endpoints
  static String get nexusAgentStreamUrl => '$webApiBaseUrl/api/nexus-agent';
  static const ollamaChatUrl = 'http://localhost:11434/api/chat';
  static String get workflowsUrl => '$webApiBaseUrl/api/workflows';
  static String get n8nWorkflowsUrl => '$webApiBaseUrl/api/workflows/n8n';
  static String get backendOrchestrationUrl => '$backendBaseUrl/v1/orchestration/execute';
  static String get knowledgeUrl => '$webApiBaseUrl/api/knowledge';
  static String get profileUrl => '$webApiBaseUrl/api/profile';
  static String get backendHealthUrl => '$backendBaseUrl/v1/health';
}
