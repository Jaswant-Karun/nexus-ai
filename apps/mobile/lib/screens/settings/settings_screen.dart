import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../guide/how_to_use_screen.dart';
import '../tokens/token_screen.dart';

class SettingsScreen extends StatefulWidget {
  final VoidCallback? onThemeToggle;
  final bool isDark;

  const SettingsScreen({super.key, this.onThemeToggle, this.isDark = false});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _notifications = true;
  bool _biometric = true;
  bool _hardwareAccel = true;

  static const _blue = Color(0xff4f52ea);

  int get _currentThemeIndex {
    switch (themeNotifier.value) {
      case ThemeMode.light:
        return 0;
      case ThemeMode.dark:
        return 1;
      case ThemeMode.system:
        return 2;
    }
  }

  void _setTheme(int val) {
    setState(() {
      if (val == 0) {
        themeNotifier.value = ThemeMode.light;
      } else if (val == 1) {
        themeNotifier.value = ThemeMode.dark;
      } else {
        themeNotifier.value = ThemeMode.system;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBg = isDark ? const Color(0xff111827) : Colors.white;
    final borderColor = isDark ? const Color(0xff1f293d) : const Color(0xffe2e8f0);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Platform Settings', style: TextStyle(fontWeight: FontWeight.w800)),
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 600),
          child: ListView(
            padding: const EdgeInsets.fromLTRB(20, 16, 20, 40),
            children: [
              // ── Guide Promo Banner ──
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(22),
                  gradient: const LinearGradient(
                    colors: [Color(0xff4341cf), Color(0xff6272f5)],
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xff4341cf).withValues(alpha: 0.3),
                      blurRadius: 16,
                      offset: const Offset(0, 6),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: const Text('📖', style: TextStyle(fontSize: 24)),
                    ),
                    const SizedBox(width: 14),
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Platform Guide (English + தமிழ்)',
                              style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                          SizedBox(height: 2),
                          Text('Learn how to use every feature on mobile.',
                              style: TextStyle(color: Color(0xffe0e9ff), fontSize: 12)),
                        ],
                      ),
                    ),
                    FilledButton(
                      style: FilledButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: _blue,
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      onPressed: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(builder: (_) => const HowToUseScreen()),
                        );
                      },
                      child: const Text('Read Guide', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // ── Visual Theme Mode Selector ──
              _sectionTitle('Appearance & Atmosphere'),
              const SizedBox(height: 10),
              Row(
                children: [
                  _themeOption('Daylight Light', '☀️', 0, isDark),
                  const SizedBox(width: 10),
                  _themeOption('Obsidian Dark', '🌙', 1, isDark),
                  const SizedBox(width: 10),
                  _themeOption('System Auto', '💻', 2, isDark),
                ],
              ),
              const SizedBox(height: 24),

              // ── Preferences Card ──
              _sectionTitle('Preferences & System Telemetry'),
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: cardBg,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: borderColor),
                ),
                child: Column(
                  children: [
                    SwitchListTile(
                      contentPadding: EdgeInsets.zero,
                      title: const Text('Push Notifications', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                      subtitle: const Text('Receive alerts from active workflows and agent executions.',
                          style: TextStyle(fontSize: 11, color: Color(0xff64748b))),
                      value: _notifications,
                      activeThumbColor: _blue,
                      onChanged: (v) => setState(() => _notifications = v),
                    ),
                    Divider(height: 16, color: borderColor),
                    SwitchListTile(
                      contentPadding: EdgeInsets.zero,
                      title: const Text('Biometric Authentication', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                      subtitle: const Text('Secure login using Face ID or fingerprint sensor.',
                          style: TextStyle(fontSize: 11, color: Color(0xff64748b))),
                      value: _biometric,
                      activeThumbColor: _blue,
                      onChanged: (v) => setState(() => _biometric = v),
                    ),
                    Divider(height: 16, color: borderColor),
                    SwitchListTile(
                      contentPadding: EdgeInsets.zero,
                      title: const Text('Neural Hardware Acceleration', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                      subtitle: const Text('Utilize local GPU / NPU shaders for low-latency inference.',
                          style: TextStyle(fontSize: 11, color: Color(0xff64748b))),
                      value: _hardwareAccel,
                      activeThumbColor: _blue,
                      onChanged: (v) => setState(() => _hardwareAccel = v),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // ── Security & API Keys ──
              _sectionTitle('Security & Access Tokens'),
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: cardBg,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: borderColor),
                ),
                child: Column(
                  children: [
                    _tile(
                      Icons.vpn_key_rounded,
                      'Active API Keys & Token Vault',
                      'Generate, view, and revoke cryptographic Bearer tokens.',
                      () {
                        Navigator.of(context).push(
                          MaterialPageRoute(builder: (_) => const TokenScreen()),
                        );
                      },
                    ),
                    Divider(height: 20, color: borderColor),
                    _tile(
                      Icons.devices_rounded,
                      'Active Sessions & Devices',
                      '3 verified JWT mobile & browser sessions connected.',
                      () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('All 3 sessions active and cryptographically signed.')),
                        );
                      },
                    ),
                    Divider(height: 20, color: borderColor),
                    _tile(
                      Icons.shield_outlined,
                      'Enterprise Privacy & Vault',
                      'AES-256 local encrypted storage enabled.',
                      () {},
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 28),

              // ── Version Footer ──
              Center(
                child: Column(
                  children: [
                    Text('Nexus AI Mobile v2.4.0 • Build 2026.09',
                        style: TextStyle(color: isDark ? const Color(0xff64748b) : const Color(0xff94a3b8), fontSize: 11)),
                    const SizedBox(height: 4),
                    const Text('Unified Adaptive Intelligence Architecture',
                        style: TextStyle(color: _blue, fontSize: 11, fontWeight: FontWeight.w600)),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _themeOption(String title, String icon, int val, bool isDark) {
    final isSelected = _currentThemeIndex == val;

    return Expanded(
      child: InkWell(
        onTap: () => _setTheme(val),
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 8),
          decoration: BoxDecoration(
            color: isSelected
                ? _blue.withValues(alpha: isDark ? 0.2 : 0.1)
                : (isDark ? const Color(0xff111827) : Colors.white),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: isSelected ? _blue : (isDark ? const Color(0xff1f293d) : const Color(0xffe2e8f0)),
              width: isSelected ? 2 : 1,
            ),
            boxShadow: isSelected
                ? [
                    BoxShadow(
                      color: _blue.withValues(alpha: 0.2),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ]
                : null,
          ),
          child: Column(
            children: [
              Text(icon, style: const TextStyle(fontSize: 22)),
              const SizedBox(height: 8),
              Text(
                title,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                  color: isSelected ? _blue : (isDark ? const Color(0xffcbd5e1) : const Color(0xff334155)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _sectionTitle(String title) {
    return Text(
      title,
      style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800),
    );
  }

  Widget _tile(IconData icon, String title, String subtitle, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 4),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: _blue.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, color: _blue, size: 20),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                  const SizedBox(height: 2),
                  Text(subtitle, style: const TextStyle(color: Color(0xff64748b), fontSize: 11)),
                ],
              ),
            ),
            const Icon(Icons.chevron_right, size: 18, color: Color(0xff64748b)),
          ],
        ),
      ),
    );
  }
}
