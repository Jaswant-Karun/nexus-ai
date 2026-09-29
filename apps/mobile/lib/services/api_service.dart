import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';

class ApiService {
  ApiService._({http.Client? client}) : _client = client ?? http.Client();
  static final ApiService instance = ApiService._();

  final http.Client _client;
  String? _authToken;

  void setAuthToken(String? token) {
    _authToken = token;
  }

  Map<String, String> _buildHeaders([Map<String, String>? extra]) {
    final headers = <String, String>{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (_authToken != null && _authToken!.isNotEmpty) {
      headers['Authorization'] = 'Bearer $_authToken';
    }
    if (extra != null) {
      headers.addAll(extra);
    }
    return headers;
  }

  Future<dynamic> get(String url, {Duration timeout = const Duration(seconds: 15)}) async {
    final res = await _client.get(Uri.parse(url), headers: _buildHeaders()).timeout(timeout);
    if (res.statusCode >= 200 && res.statusCode < 300) {
      if (res.body.isEmpty) return null;
      return jsonDecode(res.body);
    }
    throw Exception('GET $url failed [${res.statusCode}]: ${res.body}');
  }

  Future<dynamic> post(
    String url, {
    Map<String, dynamic>? body,
    Duration timeout = const Duration(seconds: 30),
  }) async {
    final res = await _client
        .post(
          Uri.parse(url),
          headers: _buildHeaders(),
          body: body != null ? jsonEncode(body) : null,
        )
        .timeout(timeout);

    if (res.statusCode >= 200 && res.statusCode < 300) {
      if (res.body.isEmpty) return null;
      return jsonDecode(res.body);
    }
    throw Exception('POST $url failed [${res.statusCode}]: ${res.body}');
  }

  /// System-wide health probe for FastAPI backend
  Future<bool> checkBackendHealth() async {
    try {
      final res = await _client
          .get(Uri.parse(ApiConfig.backendHealthUrl))
          .timeout(const Duration(seconds: 3));
      return res.statusCode == 200;
    } catch (_) {
      return false;
    }
  }
}
