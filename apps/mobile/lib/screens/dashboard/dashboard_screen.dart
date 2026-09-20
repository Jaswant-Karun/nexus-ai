import 'package:flutter/material.dart';

import '../chatbot/chat_screen_page.dart';
import '../profile/profile_screen.dart';
import '../projects/project_list_screen.dart';
import '../settings/settings_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _selectedIndex = 0;
  bool _darkMode = false;

  static const _blue = Color(0xff2d6cdf);
  static const _muted = Color(0xff6c7890);

  @override
  Widget build(BuildContext context) {
    final pages = [
      _homePage(context),
      _projectsPage(),
      _activityPage(),
      _settingsPage(),
    ];

    return Theme(
      data: Theme.of(context).copyWith(
        brightness: _darkMode ? Brightness.dark : Brightness.light,
        scaffoldBackgroundColor:
            _darkMode ? const Color(0xff111827) : const Color(0xfff5f7fb),
        colorScheme: ColorScheme.fromSeed(
          seedColor: _blue,
          brightness: _darkMode ? Brightness.dark : Brightness.light,
        ),
      ),
      child: Scaffold(
        body: SafeArea(child: pages[_selectedIndex]),
        bottomNavigationBar: NavigationBar(
          selectedIndex: _selectedIndex,
          onDestinationSelected: (index) => setState(() => _selectedIndex = index),
          destinations: const [
            NavigationDestination(
              icon: Icon(Icons.home_outlined),
              selectedIcon: Icon(Icons.home),
              label: 'Home',
            ),
            NavigationDestination(
              icon: Icon(Icons.folder_outlined),
              selectedIcon: Icon(Icons.folder),
              label: 'Projects',
            ),
            NavigationDestination(
              icon: Icon(Icons.bolt_outlined),
              selectedIcon: Icon(Icons.bolt),
              label: 'Activity',
            ),
            NavigationDestination(
              icon: Icon(Icons.settings_outlined),
              selectedIcon: Icon(Icons.settings),
              label: 'Settings',
            ),
          ],
        ),
      ),
    );
  }

  Widget _homePage(BuildContext context) {
    return CustomScrollView(
      slivers: [
        SliverPadding(
          padding: const EdgeInsets.fromLTRB(20, 18, 20, 0),
          sliver: SliverToBoxAdapter(child: _header(context)),
        ),
        SliverPadding(
          padding: const EdgeInsets.fromLTRB(20, 26, 20, 0),
          sliver: SliverToBoxAdapter(child: _welcomeCard()),
        ),
        SliverPadding(
          padding: const EdgeInsets.fromLTRB(20, 22, 20, 0),
          sliver: SliverToBoxAdapter(child: _sectionTitle('Overview', 'This week')),
        ),
        SliverPadding(
          padding: const EdgeInsets.fromLTRB(20, 12, 20, 0),
          sliver: SliverToBoxAdapter(child: _metrics()),
        ),
        SliverPadding(
          padding: const EdgeInsets.fromLTRB(20, 24, 20, 0),
          sliver: SliverToBoxAdapter(child: _sectionTitle('Quick actions', 'View all')),
        ),
        SliverPadding(
          padding: const EdgeInsets.fromLTRB(20, 12, 20, 0),
          sliver: SliverToBoxAdapter(child: _quickActions(context)),
        ),
        SliverPadding(
          padding: const EdgeInsets.fromLTRB(20, 24, 20, 30),
          sliver: SliverToBoxAdapter(child: _recentActivity()),
        ),
      ],
    );
  }

  Widget _header(BuildContext context) {
    return Row(
      children: [
        Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: _blue,
            borderRadius: BorderRadius.circular(14),
          ),
          child: const Icon(Icons.auto_awesome, color: Colors.white),
        ),
        const SizedBox(width: 12),
        const Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Good morning, Alex', style: TextStyle(fontSize: 15, color: _muted)),
              SizedBox(height: 2),
              Text('Your workspace', style: TextStyle(fontSize: 21, fontWeight: FontWeight.w700)),
            ],
          ),
        ),
        IconButton(
          tooltip: 'Notifications',
          onPressed: () => _showMessage(context, 'You are all caught up.'),
          icon: const Badge(label: Text('3'), child: Icon(Icons.notifications_none_rounded)),
        ),
      ],
    );
  }

  Widget _welcomeCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(22),
        gradient: const LinearGradient(
          colors: [Color(0xff2457c5), Color(0xff4389ed)],
        ),
      ),
      child: Row(
        children: [
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Build something\nremarkable today.',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 23,
                    fontWeight: FontWeight.w700,
                    height: 1.15,
                  ),
                ),
                SizedBox(height: 9),
                Text(
                  'Your AI workspace is ready when you are.',
                  style: TextStyle(color: Color(0xffdce8ff), fontSize: 13),
                ),
              ],
            ),
          ),
          Container(
            width: 66,
            height: 66,
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: .16),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.insights_rounded, color: Colors.white, size: 32),
          ),
        ],
      ),
    );
  }

  Widget _sectionTitle(String title, String action) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(title, style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w700)),
        Text(action, style: const TextStyle(color: _blue, fontSize: 13, fontWeight: FontWeight.w600)),
      ],
    );
  }

  Widget _metrics() {
    return Row(
      children: [
        _metricCard('12', 'Active projects', Icons.folder_copy_outlined, const Color(0xffe9f0ff)),
        const SizedBox(width: 12),
        _metricCard('84%', 'Tasks completed', Icons.task_alt_rounded, const Color(0xffe7f8f1)),
      ],
    );
  }

  Widget _metricCard(String value, String label, IconData icon, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(15),
        decoration: BoxDecoration(
          color: Theme.of(context).cardColor,
          borderRadius: BorderRadius.circular(18),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: color,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, color: _blue, size: 19),
            ),
            const SizedBox(height: 15),
            Text(value, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w700)),
            const SizedBox(height: 3),
            Text(label, style: const TextStyle(fontSize: 12, color: _muted)),
          ],
        ),
      ),
    );
  }

  Widget _quickActions(BuildContext context) {
    return Row(
      children: [
        _action(context, Icons.add_rounded, 'New project', _blue),
        const SizedBox(width: 10),
        _action(context, Icons.chat_bubble_outline_rounded, 'Ask Nexus', const Color(0xff6f52c9)),
        const SizedBox(width: 10),
        _action(context, Icons.auto_graph_rounded, 'Insights', const Color(0xff16866b)),
      ],
    );
  }

  Widget _action(BuildContext context, IconData icon, String label, Color color) {
    return Expanded(
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: () {
          if (label == 'Ask Nexus') {
            Navigator.of(context).push(
              MaterialPageRoute(builder: (_) => const ChatScreenPage()),
            );
          } else if (label == 'New project') {
            Navigator.of(context).push(
              MaterialPageRoute(builder: (_) => const ProjectListScreen()),
            );
          } else {
            _showMessage(context, '$label is ready to use.');
          }
        },
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 15, horizontal: 5),
          decoration: BoxDecoration(
            color: Theme.of(context).cardColor,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Column(
            children: [
              Icon(icon, color: color, size: 23),
              const SizedBox(height: 8),
              Text(
                label,
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _recentActivity() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _sectionTitle('Recent activity', 'See all'),
        const SizedBox(height: 12),
        _activityTile(
          Icons.check_circle_rounded,
          const Color(0xff16866b),
          'Report generated',
          'Marketing insights • 12 min ago',
        ),
        _activityTile(
          Icons.auto_awesome,
          _blue,
          'Nexus completed a task',
          'Product roadmap • 1 hour ago',
        ),
        _activityTile(
          Icons.person_add_alt_1_rounded,
          const Color(0xff6f52c9),
          'New team member joined',
          'Design system • Yesterday',
        ),
      ],
    );
  }

  Widget _activityTile(IconData icon, Color color, String title, String subtitle) {
    return ListTile(
      contentPadding: EdgeInsets.zero,
      leading: CircleAvatar(
        backgroundColor: color.withValues(alpha: .12),
        child: Icon(icon, color: color, size: 19),
      ),
      title: Text(title, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
      subtitle: Text(subtitle, style: const TextStyle(fontSize: 12, color: _muted)),
      trailing: const Icon(Icons.chevron_right, color: _muted),
    );
  }

  Widget _projectsPage() => _simplePage(
        'Projects',
        Icons.folder_copy_outlined,
        'Keep your work organized',
        ['Website redesign', 'Q3 marketing strategy', 'Customer research'],
        const [0.72, 0.48, 0.91],
      );

  Widget _activityPage() => _simplePage(
        'Activity',
        Icons.bolt_rounded,
        'A clear view of your workspace',
        ['Report generated', 'Workflow completed', 'Project updated'],
        const [1, 1, 1],
      );

  Widget _settingsPage() {
    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 24, 20, 30),
      children: [
        const Text('Settings', style: TextStyle(fontSize: 28, fontWeight: FontWeight.w700)),
        const SizedBox(height: 6),
        const Text('Make Nexus work the way you do.', style: TextStyle(color: _muted)),
        const SizedBox(height: 28),
        _settingTile(
          Icons.person_outline,
          'Profile',
          'Alex Morgan',
          () {
            Navigator.of(context).push(
              MaterialPageRoute(builder: (_) => const ProfileScreen()),
            );
          },
        ),
        _settingTile(
          Icons.notifications_none,
          'Notifications',
          'Manage alerts',
          () {
            Navigator.of(context).push(
              MaterialPageRoute(builder: (_) => const SettingsScreen()),
            );
          },
        ),
        SwitchListTile(
          contentPadding: EdgeInsets.zero,
          secondary: const Icon(Icons.dark_mode_outlined),
          title: const Text('Dark mode'),
          subtitle: const Text('Use a darker appearance'),
          value: _darkMode,
          onChanged: (value) => setState(() => _darkMode = value),
        ),
        _settingTile(
          Icons.settings_applications_outlined,
          'App settings',
          'Privacy, language, and preferences',
          () {
            Navigator.of(context).push(
              MaterialPageRoute(builder: (_) => const SettingsScreen()),
            );
          },
        ),
        _settingTile(Icons.help_outline, 'Help center', 'Get support', () {}),
      ],
    );
  }

  Widget _settingTile(IconData icon, String title, String subtitle, VoidCallback onTap) {
    return ListTile(
      contentPadding: EdgeInsets.zero,
      leading: Icon(icon, color: _blue),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.w600)),
      subtitle: Text(subtitle),
      trailing: const Icon(Icons.chevron_right),
      onTap: onTap,
    );
  }

  Widget _simplePage(
    String title,
    IconData icon,
    String subtitle,
    List<String> items,
    List<double> progress,
  ) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 24, 20, 30),
      children: [
        Text(title, style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w700)),
        const SizedBox(height: 6),
        Text(subtitle, style: const TextStyle(color: _muted)),
        const SizedBox(height: 25),
        ...List.generate(
          items.length,
          (index) => Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: ListTile(
              leading: CircleAvatar(
                backgroundColor: const Color(0xffe9f0ff),
                child: Icon(icon, color: _blue, size: 19),
              ),
              title: Text(items[index], style: const TextStyle(fontWeight: FontWeight.w600)),
              subtitle: Padding(
                padding: const EdgeInsets.only(top: 9),
                child: LinearProgressIndicator(
                  value: progress[index],
                  minHeight: 6,
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              trailing: Text(
                '${(progress[index] * 100).round()}%',
                style: const TextStyle(fontWeight: FontWeight.w700, color: _blue),
              ),
            ),
          ),
        ),
      ],
    );
  }

  void _showMessage(BuildContext context, String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }
}
