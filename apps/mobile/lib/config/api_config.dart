import 'dart:convert';
import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiConfig {
  const ApiConfig._();

  static const String _prefKeyHost = 'nexus_custom_server_host';

  /// Default LAN IP for mobile on the local development network (Wi-Fi)
  static const String defaultLanIp = '192.168.1.36';
  static const String defaultEmulatorIp = '10.0.2.2';
  static const String defaultLocalhost = 'localhost';

  static String _activeHost = defaultLanIp;
  static bool _initialized = false;

  /// Initialize config from SharedPreferences if available
  static Future<void> init() async {
    if (_initialized) return;
    try {
      final prefs = await SharedPreferences.getInstance();
      final saved = prefs.getString(_prefKeyHost);
      if (saved != null && saved.trim().isNotEmpty) {
        _activeHost = _cleanHost(saved);
      } else {
        // Sensible default based on platform
        if (!kIsWeb && Platform.isAndroid) {
          _activeHost = defaultLanIp;
        } else {
          _activeHost = defaultLocalhost;
        }
      }
    } catch (_) {
      // Fallback to LAN IP on Android
      _activeHost = defaultLanIp;
    } finally {
      _initialized = true;
    }
  }

  static String get currentHost => _activeHost;

  /// Sets and persists a custom server host / IP (e.g. "192.168.1.36", "10.0.2.2", or "http://...")
  static Future<void> setHost(String host) async {
    final cleaned = _cleanHost(host);
    if (cleaned.isEmpty) return;
    _activeHost = cleaned;
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_prefKeyHost, cleaned);
    } catch (_) {}
  }

  static String _cleanHost(String raw) {
    var h = raw.trim();
    h = h.replaceAll('http://', '').replaceAll('https://', '');
    if (h.contains('/')) {
      h = h.split('/').first;
    }
    // Remove port if present, as different services use different ports (3000, 8000, 11434)
    if (h.contains(':')) {
      h = h.split(':').first;
    }
    return h.trim().isEmpty ? defaultLanIp : h.trim();
  }

  // Base URLs
  static String get webApiBaseUrl => 'http://$_activeHost:3000';
  static String get backendBaseUrl => 'http://$_activeHost:8000';
  static String get ollamaBaseUrl => 'http://$_activeHost:11434';

  // Auth & Token endpoints
  static String get loginUrl => '$webApiBaseUrl/api/auth/login';
  static String get registerUrl => '$webApiBaseUrl/api/auth/register';
  static String get tokensUrl => '$webApiBaseUrl/api/tokens';
  static String get backendTokensUrl => '$backendBaseUrl/v1/tokens';

  // AI & Workflows endpoints
  static String get nexusAgentStreamUrl => '$webApiBaseUrl/api/nexus-agent';
  static String get feedbackUrl => '$webApiBaseUrl/api/nexus-agent/feedback';
  static String get exportTrainingDataUrl => '$webApiBaseUrl/api/nexus-agent/export-training-data';
  static String get agentTestUrl => '$webApiBaseUrl/api/nexus-agent/test';
  static String get ollamaChatUrl => '$ollamaBaseUrl/api/chat';
  static String get workflowsUrl => '$webApiBaseUrl/api/workflows';
  static String get n8nWorkflowsUrl => '$webApiBaseUrl/api/workflows/n8n';
  static String get backendOrchestrationUrl => '$backendBaseUrl/v1/orchestration/execute';
  static String get knowledgeUrl => '$webApiBaseUrl/api/knowledge';
  static String get profileUrl => '$webApiBaseUrl/api/profile';
  static String get backendHealthUrl => '$backendBaseUrl/v1/health';

  /// Probe connection to test server reachability and latency with intelligent fallback probing
  static Future<Map<String, dynamic>> testConnection([String? candidateHost]) async {
    final targets = candidateHost != null
        ? [_cleanHost(candidateHost)]
        : ArraySet([_activeHost, defaultLanIp, defaultEmulatorIp, defaultLocalhost]);

    final stopwatch = Stopwatch()..start();

    for (final host in targets) {
      // 1. Try Next.js NEXUS Agent endpoint first (port 3000)
      try {
        final uri = Uri.parse('http://$host:3000/api/nexus-agent');
        final res = await http.get(uri).timeout(const Duration(milliseconds: 2500));
        stopwatch.stop();

        if (res.statusCode == 200) {
          String model = 'Llama 3.2';
          try {
            final data = jsonDecode(res.body);
            if (data['model'] != null) model = data['model'].toString();
          } catch (_) {}

          if (host != _activeHost) {
            await setHost(host);
          }

          return {
            'success': true,
            'type': 'nextjs_agent',
            'host': host,
            'model': model,
            'latencyMs': stopwatch.elapsedMilliseconds,
            'message': 'Connected to NEXUS Agent ($model) on $host:3000',
          };
        }
      } catch (_) {}

      // 2. Try FastAPI Backend (port 8000)
      try {
        final uri = Uri.parse('http://$host:8000/v1/health');
        final res = await http.get(uri).timeout(const Duration(milliseconds: 1800));
        stopwatch.stop();

        if (res.statusCode == 200) {
          if (host != _activeHost) {
            await setHost(host);
          }
          return {
            'success': true,
            'type': 'fastapi_backend',
            'host': host,
            'model': 'FastAPI Gateway',
            'latencyMs': stopwatch.elapsedMilliseconds,
            'message': 'Connected to FastAPI Backend on $host:8000',
          };
        }
      } catch (_) {}
    }

    stopwatch.stop();
    return {
      'success': false,
      'latencyMs': stopwatch.elapsedMilliseconds,
      'message': 'Cannot reach server at $_activeHost. (On-Device ML engine active)',
    };
  }

  static List<String> ArraySet(List<String> list) {
    final seen = <String>{};
    return list.where((item) => seen.add(item)).toList();
  }
}
