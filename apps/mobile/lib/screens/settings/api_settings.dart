import 'package:flutter/material.dart';
import '../../config/api_config.dart';

class ApiSettingsScreen extends StatefulWidget {
  const ApiSettingsScreen({super.key});

  @override
  State<ApiSettingsScreen> createState() => _ApiSettingsScreenState();
}

class _ApiSettingsScreenState extends State<ApiSettingsScreen> {
  final _hostController = TextEditingController();
  bool _testing = false;
  String? _testMessage;
  bool? _testSuccess;
  int? _latencyMs;

  static const _blue = Color(0xff4f52ea);

  @override
  void initState() {
    super.initState();
    _hostController.text = ApiConfig.currentHost;
    _runTest();
  }

  @override
  void dispose() {
    _hostController.dispose();
    super.dispose();
  }

  Future<void> _runTest() async {
    setState(() {
      _testing = true;
      _testMessage = null;
    });

    final res = await ApiConfig.testConnection(_hostController.text);
    if (!mounted) return;

    setState(() {
      _testing = false;
      _testSuccess = res['success'] == true;
      _testMessage = res['message'] as String?;
      _latencyMs = res['latencyMs'] as int?;
    });
  }

  Future<void> _saveHost() async {
    final host = _hostController.text.trim();
    await ApiConfig.setHost(host);
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Server host saved: ${ApiConfig.currentHost}'),
        backgroundColor: _blue,
      ),
    );
    _runTest();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bg = isDark ? const Color(0xff090d16) : const Color(0xfff8fafc);
    final cardBg = isDark ? const Color(0xff0e1626) : Colors.white;
    final cardBorder = isDark ? const Color(0xff1e293b) : const Color(0xffe2e8f0);
    final textPrimary = isDark ? Colors.white : const Color(0xff0f172a);
    final textMuted = isDark ? const Color(0xff8ea4c8) : const Color(0xff64748b);

    return Scaffold(
      backgroundColor: bg,
      appBar: AppBar(
        title: const Text('Backend & Server Settings', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        backgroundColor: cardBg,
        elevation: 0.5,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Status card
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: cardBg,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: cardBorder),
            ),
            child: Row(
              children: [
                Container(
                  width: 42,
                  height: 42,
                  decoration: BoxDecoration(
                    color: (_testSuccess == true ? const Color(0xff10b981) : Colors.amber).withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    _testSuccess == true ? Icons.cloud_done_rounded : Icons.offline_bolt_rounded,
                    color: _testSuccess == true ? const Color(0xff10b981) : Colors.amber,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        _testSuccess == true ? 'Connected to NEXUS Server' : 'Standalone On-Device ML Mode',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: textPrimary),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        _testing
                            ? 'Testing connection...'
                            : '${_testMessage ?? "Offline intelligence operational."}${_latencyMs != null ? " (${_latencyMs}ms)" : ""}',
                        style: TextStyle(fontSize: 11, color: textMuted),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Host input card
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: cardBg,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: cardBorder),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Server IP / Hostname', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: textPrimary)),
                const SizedBox(height: 4),
                Text(
                  'Enter the IP address of the computer running NEXUS AI.',
                  style: TextStyle(fontSize: 11.5, color: textMuted),
                ),
                const SizedBox(height: 14),

                TextField(
                  controller: _hostController,
                  style: TextStyle(color: textPrimary, fontSize: 14),
                  decoration: InputDecoration(
                    prefixIcon: const Icon(Icons.dns_rounded, size: 18, color: _blue),
                    hintText: '172.168.68.146',
                    filled: true,
                    fillColor: isDark ? const Color(0xff131c2e) : const Color(0xfff8fafc),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: cardBorder)),
                    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: cardBorder)),
                    focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: _blue, width: 1.5)),
                  ),
                ),
                const SizedBox(height: 14),

                Text('Quick Presets:', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: textMuted)),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    ActionChip(
                      label: Text('Wi-Fi LAN (${ApiConfig.defaultLanIp})'),
                      onPressed: () {
                        setState(() => _hostController.text = ApiConfig.defaultLanIp);
                      },
                    ),
                    ActionChip(
                      label: const Text('Emulator (10.0.2.2)'),
                      onPressed: () {
                        setState(() => _hostController.text = ApiConfig.defaultEmulatorIp);
                      },
                    ),
                    ActionChip(
                      label: const Text('USB Cable (localhost)'),
                      onPressed: () {
                        setState(() => _hostController.text = ApiConfig.defaultLocalhost);
                      },
                    ),
                  ],
                ),
                const SizedBox(height: 18),

                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton.icon(
                        icon: _testing
                            ? const SizedBox(width: 14, height: 14, child: CircularProgressIndicator(strokeWidth: 2, color: _blue))
                            : const Icon(Icons.refresh_rounded, size: 16),
                        label: const Text('Test Ping'),
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: _blue),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          padding: const EdgeInsets.symmetric(vertical: 12),
                        ),
                        onPressed: _testing ? null : _runTest,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton.icon(
                        icon: const Icon(Icons.check_rounded, size: 16, color: Colors.white),
                        label: const Text('Save & Apply', style: TextStyle(color: Colors.white)),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: _blue,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          padding: const EdgeInsets.symmetric(vertical: 12),
                        ),
                        onPressed: _saveHost,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Endpoints summary
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: cardBg,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: cardBorder),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Active Endpoints', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: textPrimary)),
                const SizedBox(height: 10),
                _endpointRow('Web API Gateway (Port 3000):', ApiConfig.webApiBaseUrl, textMuted),
                _endpointRow('FastAPI AI Backend (Port 8000):', ApiConfig.backendBaseUrl, textMuted),
                _endpointRow('Llama 3.2 Ollama (Port 11434):', ApiConfig.ollamaBaseUrl, textMuted),
                _endpointRow('NEXUS Agent Stream:', ApiConfig.nexusAgentStreamUrl, textMuted),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _endpointRow(String title, String url, Color textMuted) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: _blue)),
          Text(url, style: TextStyle(fontSize: 11, color: textMuted, fontFamily: 'monospace')),
        ],
      ),
    );
  }
}
