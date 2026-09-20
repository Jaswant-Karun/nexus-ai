import 'package:flutter/material.dart';

import '../guide/how_to_use_screen.dart';
import '../workflows/workflow_list.dart';

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
  int _themeMode = 1; // 0: Light, 1: Dark, 2: System

  static const _blue = Color(0xff4f52ea);

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Platform Settings', style: TextStyle(fontWeight: FontWeight.w800)),
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 36),
        children: [
          // ── Guide Promo Banner ──
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20),
              gradient: const LinearGradient(
                colors: [Color(0xff4341cf), Color(0xff6272f5)],
              ),
            ),
            child: Row(
              children: [
                const Text('📖', style: TextStyle(fontSize: 28)),
                const SizedBox(width: 14),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Platform Guide (English + தமிழ்)',
                          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                      SizedBox(height: 2),
                      Text('Learn how to use every feature on mobile.',
                          style: TextStyle(color: Color(0xffe0e9ff), fontSize: 11)),
                    ],
                  ),
                ),
                FilledButton(
                  style: FilledButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: _blue,
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => const HowToUseScreen()),
                    );
                  },
                  child: const Text('Read', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
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
              const SizedBox(width: 8),
              _themeOption('Obsidian Dark', '🌙', 1, isDark),
              const SizedBox(width: 8),
              _themeOption('System Auto', '💻', 2, isDark),
            ],
          ),
          const SizedBox(height: 24),

          // ── Preferences & Notifications ──
          _sectionTitle('Preferences'),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Theme.of(context).cardColor,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: isDark ? const Color(0xff1f293d) : const Color(0xffe2e8f0)),
            ),
            child: Column(
              children: [
                SwitchListTile(
                  contentPadding: EdgeInsets.zero,
                  title: const Text('Push Notifications', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                  subtitle: const Text('Receive alerts from active workflows and agent executions.',
                      style: TextStyle(fontSize: 11, color: Color(0xff6c7890))),
                  value: _notifications,
                  activeColor: _blue,
                  onChanged: (v) => setState(() => _notifications = v),
                ),
                const Divider(height: 16),
                SwitchListTile(
                  contentPadding: EdgeInsets.zero,
                  title: const Text('Biometric Authentication', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                  subtitle: const Text('Secure login using Face ID or fingerprint sensor.',
                      style: TextStyle(fontSize: 11, color: Color(0xff6c7890))),
                  value: _biometric,
                  activeColor: _blue,
                  onChanged: (v) => setState(() => _biometric = v),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // ── Security & API Keys ──
          _sectionTitle('Security & Access Tokens'),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Theme.of(context).cardColor,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: isDark ? const Color(0xff1f293d) : const Color(0xffe2e8f0)),
            ),
            child: Column(
              children: [
                _tile(Icons.key_rounded, 'Active API Keys', 'sk-proj-...8MpD (OpenAI Active)', () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('API Keys are managed securely in server vault.')),
                  );
                }),
                const Divider(height: 16),
                _tile(Icons.phonelink_lock_rounded, 'Active Sessions', '3 verified JWT devices connected', () {}),
                const Divider(height: 16),
                _tile(Icons.shield_outlined, 'Privacy Policy & GDPR', 'Zero-Data Retention for LLM models', () {}),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // ── Quick Nav Actions ──
          FilledButton.icon(
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => const WorkflowListScreen()),
              );
            },
            icon: const Icon(Icons.account_tree_rounded),
            label: const Text('View All Workflows'),
            style: FilledButton.styleFrom(
              backgroundColor: _blue,
              padding: const EdgeInsets.symmetric(vertical: 14),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _themeOption(String title, String icon, int val, bool isDark) {
    final isSelected = _themeMode == val;
    return Expanded(
      child: InkWell(
        onTap: () {
          setState(() => _themeMode = val);
          if (widget.onThemeToggle != null) {
            widget.onThemeToggle!();
          }
        },
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 8),
          decoration: BoxDecoration(
            color: isSelected ? _blue.withValues(alpha: 0.15) : Theme.of(context).cardColor,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: isSelected ? _blue : (isDark ? const Color(0xff1f293d) : const Color(0xffe2e8f0)),
              width: isSelected ? 1.5 : 1,
            ),
          ),
          child: Column(
            children: [
              Text(icon, style: const TextStyle(fontSize: 20)),
              const SizedBox(height: 6),
              Text(
                title,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                  color: isSelected ? _blue : null,
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
      child: Row(
        children: [
          Icon(icon, color: _blue, size: 20),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                Text(subtitle, style: const TextStyle(color: Color(0xff6c7890), fontSize: 11)),
              ],
            ),
          ),
          const Icon(Icons.chevron_right, size: 18, color: Color(0xff6c7890)),
        ],
      ),
    );
  }
}
