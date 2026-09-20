import 'package:flutter/material.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _notifications = true;
  bool _darkMode = false;
  bool _biometric = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings'),
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(20, 8, 20, 32),
        children: [
          _sectionTitle('Preferences'),
          SwitchListTile(
            contentPadding: EdgeInsets.zero,
            title: const Text('Dark mode'),
            subtitle: const Text('Use a darker interface for late work.'),
            value: _darkMode,
            onChanged: (value) => setState(() => _darkMode = value),
          ),
          SwitchListTile(
            contentPadding: EdgeInsets.zero,
            title: const Text('Push notifications'),
            subtitle: const Text('Receive alerts from agents and project updates.'),
            value: _notifications,
            onChanged: (value) => setState(() => _notifications = value),
          ),
          _sectionTitle('Security'),
          SwitchListTile(
            contentPadding: EdgeInsets.zero,
            title: const Text('Biometric login'),
            subtitle: const Text('Unlock faster with Face ID or fingerprint.'),
            value: _biometric,
            onChanged: (value) => setState(() => _biometric = value),
          ),
          _tile(Icons.lock_outline, 'Password', 'Change your password'),
          _tile(Icons.shield_outlined, 'Privacy', 'Manage your data'),
          _sectionTitle('About'),
          _tile(Icons.info_outline, 'App version', '1.0.0'),
          _tile(Icons.support_agent_outlined, 'Support', 'Contact Nexus help'),
          const SizedBox(height: 12),
          FilledButton.icon(
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => const WorkflowListScreen()),
              );
            },
            icon: const Icon(Icons.account_tree_rounded),
            label: const Text('View workflows'),
            style: FilledButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _sectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(top: 18, bottom: 8),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }

  Widget _tile(IconData icon, String title, String subtitle) {
    return ListTile(
      contentPadding: EdgeInsets.zero,
      leading: Icon(icon, color: const Color(0xff2d6cdf)),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.w600)),
      subtitle: Text(subtitle),
      trailing: const Icon(Icons.chevron_right),
      onTap: () {},
    );
  }
}
