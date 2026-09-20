class ApiConfig {
  const ApiConfig._();

  // Central Backend API (FastAPI) on port 8000
  static const backendBaseUrl = String.fromEnvironment(
    'NEXUS_BACKEND_URL',
    defaultValue: 'http://localhost:8000',
  );

  // Full-Stack Web API Gateway (Next.js) on port 3000
  static const webApiBaseUrl = String.fromEnvironment(
    'NEXUS_WEB_API_URL',
    defaultValue: 'http://localhost:3000',
  );

  // Auth & Token endpoints
  static String get loginUrl => '$webApiBaseUrl/api/auth/login';
  static String get registerUrl => '$webApiBaseUrl/api/auth/register';
  static String get tokensUrl => '$webApiBaseUrl/api/tokens';
  static String get backendTokensUrl => '$backendBaseUrl/v1/tokens';

  // AI & Workflows endpoints
  static String get nexusAgentStreamUrl =>
      '$webApiBaseUrl/api/nexus-agent/chat/stream';
  static String get workflowsUrl => '$webApiBaseUrl/api/workflows';
  static String get knowledgeUrl => '$webApiBaseUrl/api/knowledge';
  static String get profileUrl => '$webApiBaseUrl/api/profile';
}
