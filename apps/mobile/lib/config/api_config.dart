class ApiConfig {
	const ApiConfig._();

	// Override for a physical device, for example:
	// flutter run --dart-define=NEXUS_API_URL=http://192.168.1.20:8001
	static const baseUrl = String.fromEnvironment(
		'NEXUS_API_URL',
		defaultValue: 'http://localhost:8001',
	);

	static String get nexusAgentStreamUrl =>
			'$baseUrl/api/v1/nexus-agent/chat/stream';
}
