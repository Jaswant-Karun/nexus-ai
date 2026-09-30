import 'dart:convert';
import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiConfig {
  const ApiConfig._();

  static const String _prefKeyHost = 'nexus_custom_server_host';

  /// Primary Public HTTPS Cloud Tunnel (Works globally across ANY mobile network: 4G, 5G, external Wi-Fi)
  static const String defaultPublicHost = 'nexus-ai-karun.loca.lt';

  /// Local development network (same Wi-Fi router)
  static const String defaultLanIp = '192.168.1.36';

  /// Android Emulator loopback
  static const String defaultEmulatorIp = '10.0.2.2';

  /// USB Debugging / Localhost
  static const String defaultLocalhost = 'localhost';

  /// Default to global public host so any device works on ANY network out of the box
  static String _activeHost = defaultPublicHost;
  static bool _initialized = false;

  /// Check whether a given host is a public domain or an internal IP/localhost
  static bool isPublicHost(String host) {
    if (host.isEmpty) return false;
    return host.contains('.') && !RegExp(r'^\d+\.\d+\.\d+\.\d+$').hasMatch(host);
  }

  /// Initialize config from SharedPreferences if available
  static Future<void> init() async {
    if (_initialized) return;
    try {
      final prefs = await SharedPreferences.getInstance();
      final saved = prefs.getString(_prefKeyHost);
      if (saved != null && saved.trim().isNotEmpty) {
        _activeHost = _cleanHost(saved);
      } else {
        if (!kIsWeb && Platform.isAndroid) {
          _activeHost = defaultPublicHost;
        } else {
          _activeHost = defaultLocalhost;
        }
      }
    } catch (_) {
      _activeHost = defaultPublicHost;
    } finally {
      _initialized = true;
    }
  }

  static String get currentHost => _activeHost;

  /// Sets and persists a custom server host / IP (e.g. "nexus-ai-karun.loca.lt", "192.168.1.36")
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
    // Remove port if present, as different services use different ports or cloud tunnels
    if (h.contains(':')) {
      h = h.split(':').first;
    }
    return h.trim().isEmpty ? defaultPublicHost : h.trim();
  }

  // Base URLs
  static String get webApiBaseUrl {
    if (isPublicHost(_activeHost)) {
      return 'https://$_activeHost';
    }
    return 'http://$_activeHost:3000';
  }

  static String get backendBaseUrl {
    if (isPublicHost(_activeHost)) {
      return 'https://$_activeHost';
    }
    return 'http://$_activeHost:8000';
  }

  static String get ollamaBaseUrl {
    if (isPublicHost(_activeHost)) {
      return 'https://$_activeHost';
    }
    return 'http://$_activeHost:11434';
  }

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

  /// Probe connection to test server reachability and latency with intelligent cross-network fallback probing
  static Future<Map<String, dynamic>> testConnection([String? candidateHost]) async {
    final targets = candidateHost != null
        ? [_cleanHost(candidateHost)]
        : ArraySet([_activeHost, defaultPublicHost, defaultLanIp, defaultEmulatorIp, defaultLocalhost]);

    final stopwatch = Stopwatch()..start();

    for (final host in targets) {
      final base = isPublicHost(host) ? 'https://$host' : 'http://$host:3000';

      // 1. Try Next.js NEXUS Agent endpoint first
      try {
        final uri = Uri.parse('$base/api/nexus-agent');
        final res = await http.get(
          uri,
          headers: {'bypass-tunnel-reminder': 'true'},
        ).timeout(const Duration(milliseconds: 2800));

        if (res.statusCode == 200) {
          stopwatch.stop();
          String model = 'Llama 3.2';
          try {
            final data = jsonDecode(res.body);
            if (data['model'] != null) model = data['model'].toString();
          } catch (_) {}

          if (host != _activeHost) {
            await setHost(host);
          }

          final isCloud = isPublicHost(host);
          final label = isCloud ? 'Cloud (Any Network • 4G/5G/External Wi-Fi)' : 'Local Wi-Fi ($host:3000)';

          return {
            'success': true,
            'type': 'nextjs_agent',
            'host': host,
            'isCloud': isCloud,
            'model': model,
            'latencyMs': stopwatch.elapsedMilliseconds,
            'message': 'Connected to NEXUS Agent ($model) via $label',
          };
        }
      } catch (_) {}

      // 2. Try FastAPI Backend (port 8000) only for IP addresses
      if (!isPublicHost(host)) {
        try {
          final uri = Uri.parse('http://$host:8000/v1/health');
          final res = await http.get(uri).timeout(const Duration(milliseconds: 1800));

          if (res.statusCode == 200) {
            stopwatch.stop();
            if (host != _activeHost) {
              await setHost(host);
            }
            return {
              'success': true,
              'type': 'fastapi_backend',
              'host': host,
              'isCloud': false,
              'model': 'FastAPI Gateway',
              'latencyMs': stopwatch.elapsedMilliseconds,
              'message': 'Connected to FastAPI Backend on $host:8000',
            };
          }
        } catch (_) {}
      }
    }

    stopwatch.stop();
    return {
      'success': false,
      'latencyMs': stopwatch.elapsedMilliseconds,
      'message': 'Cannot reach server at $_activeHost. (On-Device ML engine active • 100% Offline)',
    };
  }

  static List<String> ArraySet(List<String> list) {
    final seen = <String>{};
    return list.where((item) => seen.add(item)).toList();
  }
}
