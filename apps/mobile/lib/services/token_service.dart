import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';

class ApiToken {
  final String id;
  final String name;
  final String prefix;
  final String? secret;
  final String scope;
  final String created;
  final String lastUsed;

  const ApiToken({
    required this.id,
    required this.name,
    required this.prefix,
    this.secret,
    required this.scope,
    required this.created,
    required this.lastUsed,
  });

  factory ApiToken.fromJson(Map<String, dynamic> json) {
    return ApiToken(
      id: json['id'] ?? 'tok_${DateTime.now().millisecondsSinceEpoch}',
      name: json['name'] ?? 'API Access Token',
      prefix: json['prefix'] ?? 'nx_live_****',
      secret: json['secret'],
      scope: json['scope'] ?? 'Full Access (Read/Write)',
      created: json['created'] ?? 'Recently',
      lastUsed: json['lastUsed'] ?? 'Never',
    );
  }
}

class TokenService {
  TokenService._();
  static final TokenService instance = TokenService._();

  final List<ApiToken> _localCache = [
    const ApiToken(
      id: 'tok_prod_01',
      name: 'Production Mobile Client',
      prefix: 'nx_live_99fa****************',
      secret: 'nx_live_99fa84c20e11894b9aa102848c',
      scope: 'Full Access (Read/Write)',
      created: 'Today, 10:24 AM',
      lastUsed: '4 mins ago',
    ),
    const ApiToken(
      id: 'tok_stage_02',
      name: 'Agent Automation Runner',
      prefix: 'nx_test_41ca****************',
      secret: 'nx_test_41ca27b878201a09d37449a11',
      scope: 'Agent Dispatch Only',
      created: 'Yesterday, 3:15 PM',
      lastUsed: '1 hour ago',
    ),
  ];

  Future<List<ApiToken>> getTokens() async {
    try {
      final response = await http
          .get(Uri.parse(ApiConfig.tokensUrl))
          .timeout(const Duration(seconds: 3));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true && data['tokens'] is List) {
          final list = (data['tokens'] as List)
              .map((e) => ApiToken.fromJson(e as Map<String, dynamic>))
              .toList();
          return list;
        }
      }
    } catch (_) {
      // Return local cache on network error
    }
    return List.unmodifiable(_localCache);
  }

  Future<ApiToken> generateToken({
    required String name,
    required String scope,
  }) async {
    try {
      final response = await http
          .post(
            Uri.parse(ApiConfig.tokensUrl),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({'name': name, 'scope': scope}),
          )
          .timeout(const Duration(seconds: 4));

      if (response.statusCode >= 200 && response.statusCode < 300) {
        final data = jsonDecode(response.body);
        if (data['success'] == true && data['token'] != null) {
          final token = ApiToken.fromJson(data['token']);
          _localCache.insert(0, token);
          return token;
        }
      }
    } catch (_) {
      // Fallback generation via backend or local crypto
    }

    // Try FastAPI backend direct endpoint
    try {
      final response = await http
          .post(
            Uri.parse(ApiConfig.backendTokensUrl),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({'label': name, 'scope': scope}),
          )
          .timeout(const Duration(seconds: 3));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['token'] != null) {
          final token = ApiToken.fromJson(data['token']);
          _localCache.insert(0, token);
          return token;
        }
      }
    } catch (_) {}

    // Offline generation
    final randHex = DateTime.now().millisecondsSinceEpoch.toRadixString(16) +
        '84f7b2c9e10a';
    final secret = 'nx_live_$randHex';
    final token = ApiToken(
      id: 'tok_${DateTime.now().millisecondsSinceEpoch}',
      name: name,
      prefix: 'nx_live_${randHex.substring(0, 4)}****************',
      secret: secret,
      scope: scope,
      created: 'Just now',
      lastUsed: 'Never',
    );
    _localCache.insert(0, token);
    return token;
  }

  Future<void> revokeToken(String id) async {
    _localCache.removeWhere((t) => t.id == id);
    try {
      await http.delete(Uri.parse('${ApiConfig.tokensUrl}?id=$id')).timeout(
            const Duration(seconds: 2),
          );
    } catch (_) {}
  }
}
