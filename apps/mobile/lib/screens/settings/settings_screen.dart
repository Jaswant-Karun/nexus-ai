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
  int _selectedTab = 2; // Default to 'Integrations' matching user screenshot!

  bool _notifications = true;
  bool _biometric = true;
  bool _hardwareAccel = true;
  bool _mfa = true;
  bool _rbac = true;

  final Map<String, bool> _integrations = {
    'Slack': true,
    'GitHub': true,
    'Jira': false,
    'Notion': true,
    'Zapier': false,
    'Webhooks': true,
  };

  static const _blue = Color(0xff4f52ea);

  final _tabs = ['General', 'AI Models', 'Integrations', 'Security', 'Billing'];

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
    final cardBg = isDark ? const Color(0xff0e1626) : Colors.white;
    final cardBorder = isDark ? const Color(0xff1e293b) : const Color(0xffe2e8f0);
    final innerBg = isDark ? const Color(0xff070a12) : const Color(0xfff8fafc);
    final textPrimary = isDark ? Colors.white : const Color(0xff0f172a);
    final textMuted = isDark ? const Color(0xff8ea4c8) : const Color(0xff64748b);

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: _blue.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.bolt_rounded, color: _blue, size: 18),
            ),
            const SizedBox(width: 8),
            const Text('NEXUS AI', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 16, letterSpacing: 0.5)),
          ],
        ),
        actions: [
          IconButton(
            tooltip: 'Toggle Theme',
            icon: Icon(isDark ? Icons.light_mode_rounded : Icons.dark_mode_rounded, size: 20),
            onPressed: () => _setTheme(isDark ? 0 : 1),
          ),
          IconButton(
            tooltip: 'Token Vault',
            icon: const Icon(Icons.vpn_key_rounded, size: 20),
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => const TokenScreen()),
              );
            },
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 640),
          child: ListView(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 40),
            children: [
              // ── Header: Title & Subtitle (matching screenshot) ──
              Text(
                'Platform Settings',
                style: TextStyle(
                  fontSize: 26,
                  fontWeight: FontWeight.w900,
                  color: textPrimary,
                  letterSpacing: -0.5,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Configure your Nexus AI environment, model routing, integrations, appearance, and security policies.',
                style: TextStyle(fontSize: 12.5, color: textMuted, height: 1.4),
              ),
              const SizedBox(height: 18),

              // ── 4 KPI Stat Cards (exact match to user's uploaded screenshot) ──
              _buildMetricCardsGrid(isDark, cardBg, cardBorder, textPrimary, textMuted),
              const SizedBox(height: 20),

              // ── Tab Bar Pills (exact match to screenshot) ──
              SizedBox(
                height: 38,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  itemCount: _tabs.length,
                  separatorBuilder: (_, __) => const SizedBox(width: 8),
                  itemBuilder: (context, idx) {
                    final isSelected = _selectedTab == idx;
                    return InkWell(
                      onTap: () => setState(() => _selectedTab = idx),
                      borderRadius: BorderRadius.circular(10),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        decoration: BoxDecoration(
                          color: isSelected
                              ? (isDark ? const Color(0xff1c2b4a) : const Color(0xff0f172a))
                              : Colors.transparent,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(
                            color: isSelected
                                ? (isDark ? const Color(0xff2d4373) : const Color(0xff0f172a))
                                : Colors.transparent,
                          ),
                        ),
                        child: Center(
                          child: Text(
                            _tabs[idx],
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: isSelected ? FontWeight.bold : FontWeight.w600,
                              color: isSelected ? Colors.white : textMuted,
                            ),
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(height: 18),

              // ── Tab Contents ──
              if (_selectedTab == 0)
                _buildGeneralTab(isDark, cardBg, cardBorder, innerBg, textPrimary, textMuted)
              else if (_selectedTab == 1)
                _buildAiModelsTab(isDark, cardBg, cardBorder, innerBg, textPrimary, textMuted)
              else if (_selectedTab == 2)
                _buildIntegrationsTab(isDark, cardBg, cardBorder, innerBg, textPrimary, textMuted)
              else if (_selectedTab == 3)
                _buildSecurityTab(isDark, cardBg, cardBorder, innerBg, textPrimary, textMuted)
              else
                _buildBillingTab(isDark, cardBg, cardBorder, innerBg, textPrimary, textMuted),

              const SizedBox(height: 28),

              // ── Footer ──
              Center(
                child: Column(
                  children: [
                    Text('Nexus AI Platform • Mobile Architecture v2.4',
                        style: TextStyle(color: textMuted, fontSize: 11)),
                    const SizedBox(height: 4),
                    const Text('Next.js 15 + FastAPI + PostgreSQL + Ollama Llama 3.2',
                        style: TextStyle(color: _blue, fontSize: 11, fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ── 4 KPI Stat Cards matching screenshot ──
  Widget _buildMetricCardsGrid(
    bool isDark,
    Color cardBg,
    Color cardBorder,
    Color textPrimary,
    Color textMuted,
  ) {
    return Column(
      children: [
        Row(
          children: [
            Expanded(
              child: _statCard(
                'ACTIVE INTEGRATIONS',
                '8',
                '+2 connected',
                const Color(0xff06b6d4),
                cardBg,
                cardBorder,
                textPrimary,
                textMuted,
                isDark,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _statCard(
                'API KEYS ISSUED',
                '24',
                '3 expiring soon',
                const Color(0xff3b82f6),
                cardBg,
                cardBorder,
                textPrimary,
                textMuted,
                isDark,
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _statCard(
                'MODEL ENDPOINTS',
                '6',
                'GPT-4o, Claude, Gemini+',
                const Color(0xff6366f1),
                cardBg,
                cardBorder,
                textPrimary,
                textMuted,
                isDark,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _statCard(
                'SECURITY SCORE',
                'A+',
                'All Clear',
                const Color(0xff10b981),
                cardBg,
                cardBorder,
                textPrimary,
                textMuted,
                isDark,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _statCard(
    String label,
    String value,
    String badge,
    Color badgeColor,
    Color cardBg,
    Color cardBorder,
    Color textPrimary,
    Color textMuted,
    bool isDark,
  ) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: cardBg,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: cardBorder, width: 1.2),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: isDark ? 0.35 : 0.04),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.w800,
              letterSpacing: 0.5,
              color: textMuted,
            ),
          ),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.baseline,
            textBaseline: TextBaseline.alphabetic,
            children: [
              Text(
                value,
                style: TextStyle(
                  fontSize: 26,
                  fontWeight: FontWeight.w900,
                  color: textPrimary,
                ),
              ),
              Flexible(
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: badgeColor.withValues(alpha: isDark ? 0.15 : 0.1),
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(color: badgeColor.withValues(alpha: 0.3)),
                  ),
                  child: Text(
                    badge,
                    style: TextStyle(
                      color: badgeColor,
                      fontSize: 9.5,
                      fontWeight: FontWeight.bold,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // ── Tab 2: Connected Integrations (exact match to screenshot) ──
  Widget _buildIntegrationsTab(
    bool isDark,
    Color cardBg,
    Color cardBorder,
    Color innerBg,
    Color textPrimary,
    Color textMuted,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Section: Connected Integrations
        Container(
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            color: cardBg,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: cardBorder, width: 1.2),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Connected Integrations',
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: textPrimary),
              ),
              const SizedBox(height: 14),
              ..._integrations.entries.map((entry) {
                final connected = entry.value;
                return Container(
                  margin: const EdgeInsets.only(bottom: 10),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: innerBg,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: cardBorder),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Container(
                            width: 32,
                            height: 32,
                            decoration: BoxDecoration(
                              color: _blue.withValues(alpha: 0.15),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Icon(_getIconForService(entry.key), color: _blue, size: 16),
                          ),
                          const SizedBox(width: 10),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(entry.key, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: textPrimary)),
                              Text(_getDescForService(entry.key), style: TextStyle(color: textMuted, fontSize: 10)),
                            ],
                          ),
                        ],
                      ),
                      InkWell(
                        onTap: () {
                          setState(() {
                            _integrations[entry.key] = !connected;
                          });
                        },
                        borderRadius: BorderRadius.circular(8),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: connected
                                ? const Color(0xff10b981).withValues(alpha: isDark ? 0.15 : 0.1)
                                : (isDark ? const Color(0xff1e293b) : const Color(0xffe2e8f0)),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(
                              color: connected
                                  ? const Color(0xff10b981).withValues(alpha: 0.4)
                                  : Colors.transparent,
                            ),
                          ),
                          child: Text(
                            connected ? 'Connected' : 'Connect',
                            style: TextStyle(
                              color: connected ? const Color(0xff10b981) : textMuted,
                              fontWeight: FontWeight.bold,
                              fontSize: 11,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              }),
            ],
          ),
        ),
        const SizedBox(height: 18),

        // Section: API Keys & Token Vault
        Container(
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            color: cardBg,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: cardBorder, width: 1.2),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'API Keys & Token Vault',
                    style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: textPrimary),
                  ),
                  FilledButton.icon(
                    style: FilledButton.styleFrom(
                      backgroundColor: _blue,
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                    onPressed: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(builder: (_) => const TokenScreen()),
                      );
                    },
                    icon: const Icon(Icons.add, size: 14),
                    label: const Text('New Token', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                'Generate cryptographic nx_live_... Bearer tokens with custom scopes and instant revocation.',
                style: TextStyle(fontSize: 11.5, color: textMuted),
              ),
            ],
          ),
        ),
      ],
    );
  }

  // ── Tab 0: General & Appearance ──
  Widget _buildGeneralTab(
    bool isDark,
    Color cardBg,
    Color cardBorder,
    Color innerBg,
    Color textPrimary,
    Color textMuted,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Guide promo banner
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(18),
            gradient: const LinearGradient(colors: [Color(0xff3737a7), Color(0xff4f52ea)]),
          ),
          child: Row(
            children: [
              const Text('📖', style: TextStyle(fontSize: 24)),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    Text('How to Use Nexus AI (English + தமிழ்)',
                        style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                    Text('Every platform feature explained with roadmaps.',
                        style: TextStyle(color: Color(0xffdfe8ff), fontSize: 11)),
                  ],
                ),
              ),
              FilledButton(
                style: FilledButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: _blue,
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
                onPressed: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(builder: (_) => const HowToUseScreen()),
                  );
                },
                child: const Text('Open', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ),
        const SizedBox(height: 18),

        // Visual Theme Mode Selector
        Text('Appearance & Atmosphere', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: textPrimary)),
        const SizedBox(height: 10),
        Row(
          children: [
            _themePill('Daylight Light', '☀️', 0, isDark, cardBg, cardBorder),
            const SizedBox(width: 8),
            _themePill('Obsidian Dark', '🌙', 1, isDark, cardBg, cardBorder),
            const SizedBox(width: 8),
            _themePill('System Sync', '💻', 2, isDark, cardBg, cardBorder),
          ],
        ),
        const SizedBox(height: 20),

        // System Toggles Card
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: cardBg,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: cardBorder, width: 1.2),
          ),
          child: Column(
            children: [
              SwitchListTile(
                contentPadding: EdgeInsets.zero,
                title: Text('Push Notifications', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: textPrimary)),
                subtitle: Text('Receive alerts from active workflows and agent executions.', style: TextStyle(fontSize: 11, color: textMuted)),
                value: _notifications,
                activeThumbColor: _blue,
                onChanged: (v) => setState(() => _notifications = v),
              ),
              Divider(height: 16, color: cardBorder),
              SwitchListTile(
                contentPadding: EdgeInsets.zero,
                title: Text('Biometric Authentication', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: textPrimary)),
                subtitle: Text('Secure access using Face ID or device fingerprint.', style: TextStyle(fontSize: 11, color: textMuted)),
                value: _biometric,
                activeThumbColor: _blue,
                onChanged: (v) => setState(() => _biometric = v),
              ),
              Divider(height: 16, color: cardBorder),
              SwitchListTile(
                contentPadding: EdgeInsets.zero,
                title: Text('Neural Hardware Acceleration', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: textPrimary)),
                subtitle: Text('Direct GPU / NPU shader bindings for local inference.', style: TextStyle(fontSize: 11, color: textMuted)),
                value: _hardwareAccel,
                activeThumbColor: _blue,
                onChanged: (v) => setState(() => _hardwareAccel = v),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _themePill(String label, String emoji, int idx, bool isDark, Color cardBg, Color cardBorder) {
    final isSelected = _currentThemeIndex == idx;
    return Expanded(
      child: InkWell(
        onTap: () => _setTheme(idx),
        borderRadius: BorderRadius.circular(14),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: isSelected ? _blue.withValues(alpha: 0.15) : cardBg,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: isSelected ? _blue : cardBorder, width: isSelected ? 1.5 : 1),
          ),
          child: Column(
            children: [
              Text(emoji, style: const TextStyle(fontSize: 18)),
              const SizedBox(height: 4),
              Text(
                label,
                style: TextStyle(
                  fontSize: 10.5,
                  fontWeight: isSelected ? FontWeight.bold : FontWeight.w600,
                  color: isSelected ? _blue : (isDark ? Colors.white : const Color(0xff0f172a)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ── Tab 1: AI Models ──
  Widget _buildAiModelsTab(
    bool isDark,
    Color cardBg,
    Color cardBorder,
    Color innerBg,
    Color textPrimary,
    Color textMuted,
  ) {
    final models = [
      {'name': 'Nexus Auto-Router', 'provider': 'Hybrid Intelligence', 'latency': '45ms', 'status': 'ACTIVE'},
      {'name': 'Llama 3.2 (Local)', 'provider': 'Ollama Neural Engine', 'latency': '12ms', 'status': 'ACTIVE'},
      {'name': 'GPT-4o', 'provider': 'OpenAI Vault', 'latency': '220ms', 'status': 'ACTIVE'},
      {'name': 'Claude 3.5 Sonnet', 'provider': 'Anthropic', 'latency': '280ms', 'status': 'ACTIVE'},
    ];

    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: cardBg,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: cardBorder, width: 1.2),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Registered AI Reasoning Engines', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: textPrimary)),
          const SizedBox(height: 12),
          ...models.map((m) => Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: innerBg,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: cardBorder),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(m['name']!, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12.5, color: textPrimary)),
                        Text('${m['provider']} • Latency: ${m['latency']}', style: TextStyle(fontSize: 10.5, color: textMuted)),
                      ],
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: const Color(0xff10b981).withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(6),
                        border: Border.all(color: const Color(0xff10b981).withValues(alpha: 0.3)),
                      ),
                      child: Text(m['status']!, style: const TextStyle(color: Color(0xff10b981), fontSize: 9.5, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
              )),
        ],
      ),
    );
  }

  // ── Tab 3: Security ──
  Widget _buildSecurityTab(
    bool isDark,
    Color cardBg,
    Color cardBorder,
    Color innerBg,
    Color textPrimary,
    Color textMuted,
  ) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: cardBg,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: cardBorder, width: 1.2),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Enterprise Security & Access Policies', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: textPrimary)),
          const SizedBox(height: 14),
          SwitchListTile(
            contentPadding: EdgeInsets.zero,
            title: Text('Multi-Factor Authentication (MFA)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: textPrimary)),
            subtitle: Text('Enforce cryptographic verification for administrative actions.', style: TextStyle(fontSize: 11, color: textMuted)),
            value: _mfa,
            activeThumbColor: _blue,
            onChanged: (v) => setState(() => _mfa = v),
          ),
          Divider(height: 16, color: cardBorder),
          SwitchListTile(
            contentPadding: EdgeInsets.zero,
            title: Text('Role-Based Access Control (RBAC)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: textPrimary)),
            subtitle: Text('Strict access isolation between Admins, Engineers, and Operators.', style: TextStyle(fontSize: 11, color: textMuted)),
            value: _rbac,
            activeThumbColor: _blue,
            onChanged: (v) => setState(() => _rbac = v),
          ),
        ],
      ),
    );
  }

  // ── Tab 4: Billing ──
  Widget _buildBillingTab(
    bool isDark,
    Color cardBg,
    Color cardBorder,
    Color innerBg,
    Color textPrimary,
    Color textMuted,
  ) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: cardBg,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: cardBorder, width: 1.2),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Current Subscription', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: textPrimary)),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: _blue.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(color: _blue.withValues(alpha: 0.3)),
                ),
                child: const Text('ENTERPRISE TIER', style: TextStyle(color: _blue, fontSize: 9.5, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text('Tokens Consumed This Month: 18.4M / 50M (36.8%)', style: TextStyle(fontSize: 12, color: textMuted)),
          const SizedBox(height: 6),
          LinearProgressIndicator(
            value: 0.368,
            color: _blue,
            backgroundColor: _blue.withValues(alpha: 0.15),
            borderRadius: BorderRadius.circular(6),
          ),
        ],
      ),
    );
  }

  IconData _getIconForService(String s) {
    switch (s) {
      case 'Slack':
        return Icons.chat_bubble_outline_rounded;
      case 'GitHub':
        return Icons.code_rounded;
      case 'Jira':
        return Icons.task_alt_rounded;
      case 'Notion':
        return Icons.menu_book_rounded;
      case 'Zapier':
        return Icons.flash_on_rounded;
      default:
        return Icons.webhook_rounded;
    }
  }

  String _getDescForService(String s) {
    switch (s) {
      case 'Slack':
        return 'Send agent alerts and notifications.';
      case 'GitHub':
        return 'Trigger workflows on PR & commits.';
      case 'Jira':
        return 'Sync issue tickets with agent fleet.';
      case 'Notion':
        return 'Export RAG knowledge docs to pages.';
      case 'Zapier':
        return 'Connect to 5,000+ business tools.';
      default:
        return 'Push payloads to external webhooks.';
    }
  }
}
