import 'package:flutter/material.dart';

import '../../theme/app_theme.dart';
import '../analytics/analytics_dashboard.dart';
import '../chatbot/chat_screen_page.dart';
import '../guide/how_to_use_screen.dart';
import '../knowledge/knowledge_screen.dart';
import '../notifications/notification_list.dart';
import '../profile/profile_screen.dart';
import '../settings/settings_screen.dart';
import '../workflows/workflow_list.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _selectedIndex = 0;

  static const _blue = Color(0xff4f52ea);
  static const _muted = Color(0xff6c7890);

  bool get _darkMode => Theme.of(context).brightness == Brightness.dark;

  void _toggleTheme() {
    setState(() {
      if (themeNotifier.value == ThemeMode.dark) {
        themeNotifier.value = ThemeMode.light;
      } else {
        themeNotifier.value = ThemeMode.dark;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final pages = [
      _homePage(context),
      const ChatScreenPage(),
      const WorkflowListScreen(),
      const KnowledgeScreen(),
      ProfileScreen(onThemeToggle: _toggleTheme, isDark: isDark),
    ];

    return Scaffold(
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 600),
            child: pages[_selectedIndex],
          ),
        ),
      ),
        bottomNavigationBar: NavigationBar(
          selectedIndex: _selectedIndex,
          onDestinationSelected: (index) => setState(() => _selectedIndex = index),
          elevation: 4,
          destinations: const [
            NavigationDestination(
              icon: Icon(Icons.home_outlined),
              selectedIcon: Icon(Icons.home_rounded, color: _blue),
              label: 'Home',
            ),
            NavigationDestination(
              icon: Icon(Icons.smart_toy_outlined),
              selectedIcon: Icon(Icons.smart_toy_rounded, color: _blue),
              label: 'AI Chat',
            ),
            NavigationDestination(
              icon: Icon(Icons.account_tree_outlined),
              selectedIcon: Icon(Icons.account_tree_rounded, color: _blue),
              label: 'Workflows',
            ),
            NavigationDestination(
              icon: Icon(Icons.psychology_outlined),
              selectedIcon: Icon(Icons.psychology_rounded, color: _blue),
              label: 'Knowledge',
            ),
            NavigationDestination(
              icon: Icon(Icons.person_outline_rounded),
              selectedIcon: Icon(Icons.person_rounded, color: _blue),
              label: 'Profile',
            ),
          ],
        ),
      );
    }

  Widget _homePage(BuildContext context) {
    return CustomScrollView(
      slivers: [
        SliverPadding(
          padding: const EdgeInsets.fromLTRB(20, 14, 20, 0),
          sliver: SliverToBoxAdapter(child: _header(context)),
        ),
        SliverPadding(
          padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
          sliver: SliverToBoxAdapter(child: _welcomeCard(context)),
        ),
        SliverPadding(
          padding: const EdgeInsets.fromLTRB(20, 22, 20, 0),
          sliver: SliverToBoxAdapter(child: _sectionTitle(context, 'AI Overview', 'View live')),
        ),
        SliverPadding(
          padding: const EdgeInsets.fromLTRB(20, 12, 20, 0),
          sliver: SliverToBoxAdapter(child: _metrics(context)),
        ),
        SliverPadding(
          padding: const EdgeInsets.fromLTRB(20, 24, 20, 0),
          sliver: SliverToBoxAdapter(child: _sectionTitle(context, 'Platform modules', '5 active')),
        ),
        SliverPadding(
          padding: const EdgeInsets.fromLTRB(20, 12, 20, 0),
          sliver: SliverToBoxAdapter(child: _quickActions(context)),
        ),
        SliverPadding(
          padding: const EdgeInsets.fromLTRB(20, 24, 20, 32),
          sliver: SliverToBoxAdapter(child: _recentActivity(context)),
        ),
      ],
    );
  }

  Widget _header(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Row(
      children: [
        Container(
          width: 42,
          height: 42,
          decoration: BoxDecoration(
            gradient: const LinearGradient(colors: [Color(0xff4341cf), Color(0xff6272f5)]),
            borderRadius: BorderRadius.circular(14),
          ),
          child: const Icon(Icons.auto_awesome, color: Colors.white, size: 20),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Nexus AI Enterprise',
                  style: TextStyle(
                    fontSize: 12,
                    color: isDark ? const Color(0xff94a3b8) : _muted,
                    fontWeight: FontWeight.w600,
                  )),
              Text(
                'Jaswant Karun',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                  color: isDark ? Colors.white : const Color(0xff0f172a),
                ),
              ),
            ],
          ),
        ),
        // Bilingual Guide Button
        IconButton(
          tooltip: 'How to Use Guide',
          icon: const Text('📖', style: TextStyle(fontSize: 18)),
          onPressed: () {
            Navigator.of(context).push(
              MaterialPageRoute(builder: (_) => const HowToUseScreen()),
            );
          },
        ),
        // Theme toggle button
        IconButton(
          tooltip: 'Toggle Theme',
          icon: Icon(_darkMode ? Icons.light_mode_rounded : Icons.dark_mode_rounded, size: 21),
          onPressed: _toggleTheme,
        ),
        // Settings
        IconButton(
          tooltip: 'Settings',
          icon: const Icon(Icons.settings_outlined, size: 21),
          onPressed: () {
            Navigator.of(context).push(
              MaterialPageRoute(builder: (_) => const SettingsScreen()),
            );
          },
        ),
        // Notifications
        IconButton(
          tooltip: 'Notifications',
          onPressed: () {
            Navigator.of(context).push(
              MaterialPageRoute(builder: (_) => const NotificationListScreen()),
            );
          },
          icon: const Badge(label: Text('3'), child: Icon(Icons.notifications_none_rounded, size: 22)),
        ),
      ],
    );
  }

  Widget _welcomeCard(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        gradient: const LinearGradient(
          colors: [Color(0xff3737a7), Color(0xff4f52ea)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xff4f52ea).withValues(alpha: 0.3),
            blurRadius: 16,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Text('ENTERPRISE TIER',
                    style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
              ),
              const Text('🟢 Multi-Model Online', style: TextStyle(color: Color(0xffc7d7fe), fontSize: 11)),
            ],
          ),
          const SizedBox(height: 12),
          const Text(
            'Universal Adaptive\nIntelligence Platform',
            style: TextStyle(
              color: Colors.white,
              fontSize: 22,
              fontWeight: FontWeight.w900,
              height: 1.2,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Deploy autonomous agents, trigger visual workflows, and query your vector knowledge base.',
            style: TextStyle(color: Color(0xffdce8ff), fontSize: 12, height: 1.3),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              FilledButton.icon(
                style: FilledButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: _blue,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                ),
                onPressed: () => setState(() => _selectedIndex = 1),
                icon: const Icon(Icons.chat_bubble_rounded, size: 16),
                label: const Text('Start AI Chat', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
              ),
              const SizedBox(width: 10),
              OutlinedButton.icon(
                style: OutlinedButton.styleFrom(
                  foregroundColor: Colors.white,
                  side: const BorderSide(color: Colors.white70),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                ),
                onPressed: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(builder: (_) => const HowToUseScreen()),
                  );
                },
                icon: const Icon(Icons.menu_book_rounded, size: 16),
                label: const Text('Guide (தமிழ்)', style: TextStyle(fontSize: 12)),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _sectionTitle(BuildContext context, String title, String action) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          title,
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w800,
            color: isDark ? Colors.white : const Color(0xff0f172a),
          ),
        ),
        Text(action, style: const TextStyle(color: _blue, fontSize: 12, fontWeight: FontWeight.w600)),
      ],
    );
  }

  Widget _metrics(BuildContext context) {
    return Row(
      children: [
        _metricCard(context, '14.8M', 'Vector Tokens', Icons.psychology_rounded, const Color(0xff4f52ea)),
        const SizedBox(width: 10),
        _metricCard(context, '6 Swarms', 'Active Agents', Icons.smart_toy_rounded, const Color(0xff10b981)),
        const SizedBox(width: 10),
        _metricCard(context, '99.99%', 'System Uptime', Icons.bolt_rounded, const Color(0xff06b6d4)),
      ],
    );
  }

  Widget _metricCard(BuildContext context, String value, String label, IconData icon, Color color) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBg = isDark ? const Color(0xff0e1626) : Colors.white;
    final cardBorder = isDark ? const Color(0xff1e293b) : const Color(0xffe2e8f0);
    final textPrimary = isDark ? Colors.white : const Color(0xff0f172a);
    final textMuted = isDark ? const Color(0xff94a3b8) : const Color(0xff64748b);

    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: cardBg,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: cardBorder, width: 1.2),
          boxShadow: isDark
              ? [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.35),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ]
              : [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.04),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(7),
              decoration: BoxDecoration(
                color: color.withValues(alpha: isDark ? 0.2 : 0.12),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, color: color, size: 18),
            ),
            const SizedBox(height: 12),
            Text(value, style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: textPrimary)),
            const SizedBox(height: 2),
            Text(label, style: TextStyle(fontSize: 10, color: textMuted, fontWeight: FontWeight.w500)),
          ],
        ),
      ),
    );
  }

  Widget _quickActions(BuildContext context) {
    return Column(
      children: [
        Row(
          children: [
            _actionBtn(context, Icons.smart_toy_rounded, 'Ask AI Agent', const Color(0xff4f52ea), () {
              setState(() => _selectedIndex = 1);
            }),
            const SizedBox(width: 10),
            _actionBtn(context, Icons.account_tree_rounded, 'Workflows', const Color(0xff9333ea), () {
              setState(() => _selectedIndex = 2);
            }),
          ],
        ),
        const SizedBox(height: 10),
        Row(
          children: [
            _actionBtn(context, Icons.psychology_rounded, 'Knowledge RAG', const Color(0xff06b6d4), () {
              setState(() => _selectedIndex = 3);
            }),
            const SizedBox(width: 10),
            _actionBtn(context, Icons.insights_rounded, 'Live Analytics', const Color(0xfff59e0b), () {
              Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => const AnalyticsDashboardScreen()),
              );
            }),
          ],
        ),
      ],
    );
  }

  Widget _actionBtn(BuildContext context, IconData icon, String label, Color color, VoidCallback onTap) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBg = isDark ? const Color(0xff0e1626) : Colors.white;
    final cardBorder = isDark ? const Color(0xff1e293b) : const Color(0xffe2e8f0);
    final textPrimary = isDark ? Colors.white : const Color(0xff0f172a);

    return Expanded(
      child: InkWell(
        borderRadius: BorderRadius.circular(18),
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: cardBg,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: cardBorder, width: 1.2),
            boxShadow: isDark
                ? [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.35),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ]
                : [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.04),
                      blurRadius: 8,
                      offset: const Offset(0, 2),
                    ),
                  ],
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: color.withValues(alpha: isDark ? 0.2 : 0.12),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(icon, color: color, size: 20),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  label,
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: textPrimary),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _recentActivity(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBg = isDark ? const Color(0xff0e1626) : Colors.white;
    final cardBorder = isDark ? const Color(0xff1e293b) : const Color(0xffe2e8f0);
    final textPrimary = isDark ? Colors.white : const Color(0xff0f172a);

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: cardBg,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: cardBorder, width: 1.2),
        boxShadow: isDark
            ? [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.35),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ]
            : [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.04),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Recent Telemetry Log', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: textPrimary)),
          const SizedBox(height: 12),
          _activityTile(
            context,
            Icons.check_circle_rounded,
            const Color(0xff10b981),
            'Lead Pipeline Executed',
            'Webhook dispatched 42 events · 4 min ago',
          ),
          Divider(height: 16, color: cardBorder),
          _activityTile(
            context,
            Icons.auto_awesome,
            _blue,
            'GPT-4o Vector Query Completed',
            'Grounded in 14.8M token RAG index · 18 min ago',
          ),
          Divider(height: 16, color: cardBorder),
          _activityTile(
            context,
            Icons.security_rounded,
            const Color(0xff9333ea),
            'SOC 2 Compliance Scan Passed',
            'Zero PII leaks detected · 1 hour ago',
          ),
        ],
      ),
    );
  }

  Widget _activityTile(BuildContext context, IconData icon, Color color, String title, String subtitle) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = isDark ? Colors.white : const Color(0xff0f172a);
    final textMuted = isDark ? const Color(0xff94a3b8) : const Color(0xff64748b);

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: const EdgeInsets.all(7),
          decoration: BoxDecoration(
            color: color.withValues(alpha: isDark ? 0.2 : 0.12),
            shape: BoxShape.circle,
          ),
          child: Icon(icon, color: color, size: 16),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: textPrimary)),
              Text(subtitle, style: TextStyle(fontSize: 10, color: textMuted)),
            ],
          ),
        ),
      ],
    );
  }
}
