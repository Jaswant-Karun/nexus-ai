import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class ProfileScreen extends StatefulWidget {
  final VoidCallback? onThemeToggle;
  final bool isDark;

  const ProfileScreen({super.key, this.onThemeToggle, this.isDark = false});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _nameController = TextEditingController(text: 'Jaswant Karun');
  final _emailController = TextEditingController(text: 'admin@nexus.ai');
  final _titleController = TextEditingController(text: 'Senior Autonomous Systems Architect');
  final _bioController = TextEditingController(
      text: 'Architecting adaptive intelligence graphs, swarm orchestrations, and deterministic LLM execution pipelines at scale.');
  final _copilotNameController = TextEditingController(text: 'AURA-7');

  String _copilotTone = 'Technical & Concise';
  String _copilotModel = 'GPT-4o';
  int _selectedArchetype = 0;
  bool _saved = false;

  static const _blue = Color(0xff4f52ea);

  final _archetypes = [
    {'icon': '⚡', 'label': 'Architect', 'color': Color(0xff4f52ea)},
    {'icon': '🧠', 'label': 'Synthesizer', 'color': Color(0xff9333ea)},
    {'icon': '🌌', 'label': 'Quantum', 'color': Color(0xff06b6d4)},
    {'icon': '🛡️', 'label': 'Sentinel', 'color': Color(0xff10b981)},
    {'icon': '🔮', 'label': 'Strategist', 'color': Color(0xfff59e0b)},
    {'icon': '🚀', 'label': 'Pioneer', 'color': Color(0xffef4444)},
  ];

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _titleController.dispose();
    _bioController.dispose();
    _copilotNameController.dispose();
    super.dispose();
  }

  void _copyKey() {
    Clipboard.setData(const ClipboardData(text: 'NEXUS-USR-9842-X7'));
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('✓ Public Neural Key copied to clipboard!')),
    );
  }

  void _saveProfile() {
    setState(() => _saved = true);
    Future.delayed(const Duration(seconds: 3), () {
      if (mounted) setState(() => _saved = false);
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('✓ Profile & AI Persona saved successfully!')),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Neural Identity Hub', style: TextStyle(fontWeight: FontWeight.w800)),
        actions: [
          IconButton(
            tooltip: 'Copy ID',
            icon: const Icon(Icons.copy_rounded, size: 19),
            onPressed: _copyKey,
          ),
          if (widget.onThemeToggle != null)
            IconButton(
              tooltip: 'Toggle Theme',
              icon: Icon(isDark ? Icons.light_mode_rounded : Icons.dark_mode_rounded),
              onPressed: widget.onThemeToggle,
            ),
        ],
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 600),
          child: ListView(
            padding: const EdgeInsets.fromLTRB(20, 12, 20, 36),
            children: [
          // ── 1. Cyber Identity Hero Card ──
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(26),
              gradient: const LinearGradient(
                colors: [Color(0xff3737a7), Color(0xff4f52ea)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xff4f52ea).withValues(alpha: 0.35),
                  blurRadius: 20,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: Column(
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Avatar Archetype Circle
                    Stack(
                      children: [
                        Container(
                          width: 68,
                          height: 68,
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.2),
                            shape: BoxShape.circle,
                            border: Border.all(color: Colors.white, width: 2),
                          ),
                          child: Center(
                            child: Text(
                              _archetypes[_selectedArchetype]['icon'] as String,
                              style: const TextStyle(fontSize: 32),
                            ),
                          ),
                        ),
                        Positioned(
                          right: 0,
                          bottom: 0,
                          child: Container(
                            width: 18,
                            height: 18,
                            decoration: BoxDecoration(
                              color: const Color(0xff10b981),
                              shape: BoxShape.circle,
                              border: Border.all(color: Colors.white, width: 2),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                decoration: BoxDecoration(
                                  color: Colors.white.withValues(alpha: 0.2),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: const Text(
                                  'CLEARANCE: LEVEL 5',
                                  style: TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold),
                                ),
                              ),
                              const SizedBox(width: 6),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                decoration: BoxDecoration(
                                  color: const Color(0xff10b981).withValues(alpha: 0.3),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: const Text(
                                  '99.8% SYNC',
                                  style: TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          Text(
                            _nameController.text,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 19,
                              fontWeight: FontWeight.w900,
                            ),
                          ),
                          Text(
                            _titleController.text,
                            style: const TextStyle(color: Color(0xffc7d7fe), fontSize: 11),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                // Click to copy Key
                InkWell(
                  onTap: _copyKey,
                  borderRadius: BorderRadius.circular(12),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    decoration: BoxDecoration(
                      color: Colors.black.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('🆔 NEXUS-USR-9842-X7',
                            style: TextStyle(color: Colors.white, fontSize: 11, fontFamily: 'monospace')),
                        Text('Tap to copy', style: TextStyle(color: Color(0xffc7d7fe), fontSize: 10)),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Archetype Selector
          const Text('Select Persona Archetype', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
          const SizedBox(height: 10),
          SizedBox(
            height: 42,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: _archetypes.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (context, idx) {
                final isSelected = _selectedArchetype == idx;
                final a = _archetypes[idx];
                return InkWell(
                  onTap: () => setState(() => _selectedArchetype = idx),
                  borderRadius: BorderRadius.circular(14),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    decoration: BoxDecoration(
                      color: isSelected ? (a['color'] as Color).withValues(alpha: 0.15) : Theme.of(context).cardColor,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(
                        color: isSelected ? (a['color'] as Color) : (isDark ? const Color(0xff1f293d) : const Color(0xffe2e8f0)),
                        width: isSelected ? 1.5 : 1,
                      ),
                    ),
                    child: Row(
                      children: [
                        Text(a['icon'] as String, style: const TextStyle(fontSize: 16)),
                        const SizedBox(width: 6),
                        Text(
                          a['label'] as String,
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                            color: isSelected ? (a['color'] as Color) : null,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 22),

          // ── 2. Cognitive Telemetry Progress Gauges ──
          const Text('Cognitive Telemetry', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
          const SizedBox(height: 10),
          Row(
            children: [
              _gaugeItem('Autonomous Swarms', '88% Active', 0.88, const Color(0xff4f52ea), isDark),
              const SizedBox(width: 10),
              _gaugeItem('Neural Workflows', '76% Optimal', 0.76, const Color(0xff9333ea), isDark),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              _gaugeItem('Vector Memory', '14.8M Tokens', 0.94, const Color(0xff06b6d4), isDark),
              const SizedBox(width: 10),
              _gaugeItem('Crypto Files', '100% Encrypted', 1.0, const Color(0xff10b981), isDark),
            ],
          ),
          const SizedBox(height: 22),

          // ── 3. 30-Day Activity Heatmap Grid ──
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Theme.of(context).cardColor,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: isDark ? const Color(0xff1f293d) : const Color(0xffe2e8f0)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('📈 Neural Activity Pulse', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                    Text('🔥 24-Day Streak', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xff10b981))),
                  ],
                ),
                const SizedBox(height: 12),
                GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 10,
                    mainAxisSpacing: 5,
                    crossAxisSpacing: 5,
                    childAspectRatio: 1.2,
                  ),
                  itemCount: 30,
                  itemBuilder: (context, i) {
                    final ops = (i % 3 == 0) ? 28 : (i % 2 == 0) ? 16 : 8;
                    Color cellColor;
                    if (ops > 20) {
                      cellColor = _blue;
                    } else if (ops > 12) {
                      cellColor = const Color(0xff8196fa);
                    } else {
                      cellColor = isDark ? const Color(0xff1e293b) : const Color(0xffe2e8f0);
                    }
                    return Container(
                      decoration: BoxDecoration(
                        color: cellColor,
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Center(
                        child: Text(
                          '${i + 1}',
                          style: TextStyle(
                            fontSize: 9,
                            fontWeight: FontWeight.bold,
                            color: ops > 12 ? Colors.white : const Color(0xff64748b),
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: 22),

          // ── 4. Personal AI Co-Pilot Customizer ──
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: Theme.of(context).cardColor,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: isDark ? const Color(0xff1f293d) : const Color(0xffe2e8f0)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.smart_toy_rounded, color: _blue, size: 20),
                    SizedBox(width: 8),
                    Text('Personal AI Co-Pilot Configuration', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                  ],
                ),
                const SizedBox(height: 14),
                TextField(
                  controller: _copilotNameController,
                  decoration: InputDecoration(
                    labelText: 'Companion Codename',
                    filled: true,
                    fillColor: isDark ? const Color(0xff111827) : const Color(0xfff8fafc),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                ),
                const SizedBox(height: 12),
                DropdownButtonFormField<String>(
                  initialValue: _copilotTone,
                  decoration: InputDecoration(
                    labelText: 'Communication Tone',
                    filled: true,
                    fillColor: isDark ? const Color(0xff111827) : const Color(0xfff8fafc),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  items: const [
                    DropdownMenuItem(value: 'Technical & Concise', child: Text('Technical & Concise')),
                    DropdownMenuItem(value: 'Visionary Architect', child: Text('Visionary Architect')),
                    DropdownMenuItem(value: 'Deep Analytical', child: Text('Deep Analytical')),
                  ],
                  onChanged: (v) => setState(() => _copilotTone = v!),
                ),
                const SizedBox(height: 12),
                DropdownButtonFormField<String>(
                  initialValue: _copilotModel,
                  decoration: InputDecoration(
                    labelText: 'Default Reasoning Engine',
                    filled: true,
                    fillColor: isDark ? const Color(0xff111827) : const Color(0xfff8fafc),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  items: const [
                    DropdownMenuItem(value: 'GPT-4o', child: Text('GPT-4o (High Speed & Code)')),
                    DropdownMenuItem(value: 'Claude 3.5 Sonnet', child: Text('Claude 3.5 Sonnet (Analysis)')),
                    DropdownMenuItem(value: 'Gemini 1.5 Pro', child: Text('Gemini 1.5 Pro (2M Context)')),
                    DropdownMenuItem(value: 'LLaMA 3.1', child: Text('LLaMA 3.1 (Local / Free)')),
                  ],
                  onChanged: (v) => setState(() => _copilotModel = v!),
                ),
              ],
            ),
          ),
          const SizedBox(height: 22),

          // ── 5. Personal Details Form ──
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: Theme.of(context).cardColor,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: isDark ? const Color(0xff1f293d) : const Color(0xffe2e8f0)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Account Information', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                const SizedBox(height: 14),
                TextField(
                  controller: _nameController,
                  decoration: InputDecoration(
                    labelText: 'Full Name',
                    filled: true,
                    fillColor: isDark ? const Color(0xff111827) : const Color(0xfff8fafc),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: _emailController,
                  decoration: InputDecoration(
                    labelText: 'Email Address',
                    filled: true,
                    fillColor: isDark ? const Color(0xff111827) : const Color(0xfff8fafc),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: _titleController,
                  decoration: InputDecoration(
                    labelText: 'Title / Designation',
                    filled: true,
                    fillColor: isDark ? const Color(0xff111827) : const Color(0xfff8fafc),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: _bioController,
                  maxLines: 2,
                  decoration: InputDecoration(
                    labelText: 'Bio Statement',
                    filled: true,
                    fillColor: isDark ? const Color(0xff111827) : const Color(0xfff8fafc),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Save Button
          FilledButton.icon(
            onPressed: _saveProfile,
            icon: const Icon(Icons.save_rounded),
            label: Text(_saved ? '✓ Changes Saved' : 'Save Changes'),
            style: FilledButton.styleFrom(
              backgroundColor: _blue,
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            ),
          ),
        ],
      ),
    ),
  ),
);
  }

  Widget _gaugeItem(String title, String status, double progress, Color color, bool isDark) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: Theme.of(context).cardColor,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: isDark ? const Color(0xff1f293d) : const Color(0xffe2e8f0)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: const TextStyle(fontSize: 11, color: Color(0xff6c7890))),
            const SizedBox(height: 4),
            Text(status, style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: color)),
            const SizedBox(height: 8),
            LinearProgressIndicator(
              value: progress,
              color: color,
              backgroundColor: color.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(8),
            ),
          ],
        ),
      ),
    );
  }
}
