import 'package:flutter/material.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(20, 16, 20, 32),
        children: [
          Center(
            child: Column(
              children: [
                CircleAvatar(
                  radius: 46,
                  backgroundColor: const Color(0xffe9f0ff),
                  child: const Icon(Icons.person, size: 50, color: Color(0xff2d6cdf)),
                ),
                const SizedBox(height: 16),
                const Text(
                  'Alex Morgan',
                  style: TextStyle(fontSize: 24, fontWeight: FontWeight.w800),
                ),
                const SizedBox(height: 6),
                const Text(
                  'Product lead · Nexus AI',
                  style: TextStyle(color: Color(0xff6c7890), fontSize: 14),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          _tile(Icons.mail_outline, 'Email', 'alex@nexus.ai'),
          _tile(Icons.phone_rounded, 'Phone', '+1 (415) 555-0142'),
          _tile(Icons.work_outline_rounded, 'Role', 'AI product manager'),
          _tile(Icons.location_on_outlined, 'Location', 'San Francisco, CA'),
          const SizedBox(height: 20),
          FilledButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.edit_note_rounded),
            label: const Text('Edit profile'),
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

  Widget _tile(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        leading: Icon(icon, color: const Color(0xff2d6cdf)),
        title: Text(label, style: const TextStyle(fontSize: 12, color: Color(0xff6c7890))),
        subtitle: Text(value, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15)),
      ),
    );
  }
}
