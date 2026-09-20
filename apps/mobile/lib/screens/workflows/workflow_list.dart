import 'package:flutter/material.dart';

class WorkflowListScreen extends StatefulWidget {
  const WorkflowListScreen({super.key});

  @override
  State<WorkflowListScreen> createState() => _WorkflowListScreenState();
}

class _WorkflowListScreenState extends State<WorkflowListScreen> {
  int _selectedFilter = 0;
  static const _blue = Color(0xff4f52ea);

  final _filters = ['All', 'Active', 'Scheduled', 'Paused'];

  final _workflows = [
    {
      'id': 'wf-1',
      'name': 'Enterprise Lead Qualification Pipeline',
      'trigger': 'Webhook (POST /api/leads)',
      'status': 'Active',
      'lastRun': '4 mins ago',
      'runs': '1,420 runs',
      'success': '99.4%',
      'color': Color(0xff10b981),
      'icon': Icons.bolt_rounded,
    },
    {
      'id': 'wf-2',
      'name': 'RAG Knowledge Vector Ingestion Daemon',
      'trigger': 'File Upload Event',
      'status': 'Active',
      'lastRun': '18 mins ago',
      'runs': '380 runs',
      'success': '100%',
      'color': Color(0xff06b6d4),
      'icon': Icons.psychology_rounded,
    },
    {
      'id': 'wf-3',
      'name': 'Autonomous Code Review & Refactor Agent',
      'trigger': 'GitHub Webhook (PR Open)',
      'status': 'Active',
      'lastRun': '1 hour ago',
      'runs': '84 runs',
      'success': '97.6%',
      'color': Color(0xff4f52ea),
      'icon': Icons.code_rounded,
    },
    {
      'id': 'wf-4',
      'name': 'Nightly Security & Compliance Audit Sweep',
      'trigger': 'Cron (Every midnight UTC)',
      'status': 'Scheduled',
      'lastRun': 'Yesterday at 00:00',
      'runs': '62 runs',
      'success': '100%',
      'color': Color(0xff9333ea),
      'icon': Icons.security_rounded,
    },
    {
      'id': 'wf-5',
      'name': 'Social Sentiment Analysis & Alerting',
      'trigger': 'Twitter/X Stream Event',
      'status': 'Paused',
      'lastRun': '3 days ago',
      'runs': '540 runs',
      'success': '95.2%',
      'color': Color(0xfff59e0b),
      'icon': Icons.campaign_rounded,
    },
  ];

  void _triggerWorkflow(Map<String, dynamic> wf, bool isDark) {
    final cardBg = isDark ? const Color(0xff0e1626) : Colors.white;
    final textPrimary = isDark ? Colors.white : const Color(0xff0f172a);
    final textMuted = isDark ? const Color(0xff94a3b8) : const Color(0xff6c7890);

    showModalBottomSheet(
      context: context,
      backgroundColor: cardBg,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: (wf['color'] as Color).withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(wf['icon'] as IconData, color: wf['color'] as Color, size: 24),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(wf['name'] as String, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: textPrimary)),
                        Text('Trigger: ${wf['trigger']}', style: TextStyle(fontSize: 11, color: textMuted)),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              Text('Execute manual run with mock payload?', style: TextStyle(fontSize: 13, color: textMuted)),
              const SizedBox(height: 18),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      style: OutlinedButton.styleFrom(
                        side: BorderSide(color: isDark ? const Color(0xff1e293b) : const Color(0xffe2e8f0)),
                        foregroundColor: textPrimary,
                      ),
                      onPressed: () => Navigator.pop(context),
                      child: const Text('Cancel'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: FilledButton(
                      style: FilledButton.styleFrom(backgroundColor: _blue),
                      onPressed: () {
                        Navigator.pop(context);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('✓ Triggered: ${wf['name']} successfully! Payload dispatched.'),
                            backgroundColor: const Color(0xff10b981),
                          ),
                        );
                      },
                      child: const Text('Run Pipeline'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBg = isDark ? const Color(0xff111827) : Colors.white;
    final cardBorder = isDark ? const Color(0xff1f2937) : const Color(0xffe2e8f0);
    final innerBoxBg = isDark ? const Color(0xff030712) : const Color(0xfff8fafc);
    final textPrimary = isDark ? Colors.white : const Color(0xff0f172a);
    final textMuted = isDark ? const Color(0xff94a3b8) : const Color(0xff6c7890);

    final filtered = _workflows.where((w) {
      if (_selectedFilter == 0) return true;
      if (_selectedFilter == 1) return w['status'] == 'Active';
      if (_selectedFilter == 2) return w['status'] == 'Scheduled';
      if (_selectedFilter == 3) return w['status'] == 'Paused';
      return true;
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Workflows & Automations', style: TextStyle(fontWeight: FontWeight.w800)),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Drag-and-drop Visual Canvas is available on the Web dashboard.')),
          );
        },
        backgroundColor: _blue,
        icon: const Icon(Icons.add_rounded, color: Colors.white),
        label: const Text('New Pipeline', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 600),
          child: ListView(
            padding: const EdgeInsets.fromLTRB(20, 12, 20, 80),
            children: [
              // Filter Chips
              SizedBox(
                height: 38,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  itemCount: _filters.length,
                  separatorBuilder: (_, __) => const SizedBox(width: 8),
                  itemBuilder: (context, idx) {
                    final isSelected = _selectedFilter == idx;
                    return ChoiceChip(
                      label: Text(_filters[idx]),
                      selected: isSelected,
                      selectedColor: _blue,
                      backgroundColor: isDark ? const Color(0xff111827) : const Color(0xfff1f5f9),
                      side: BorderSide(color: isSelected ? _blue : cardBorder),
                      labelStyle: TextStyle(
                        color: isSelected ? Colors.white : textMuted,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                      onSelected: (_) => setState(() => _selectedFilter = idx),
                    );
                  },
                ),
              ),
              const SizedBox(height: 18),

              ...filtered.map((wf) => Container(
                    margin: const EdgeInsets.only(bottom: 14),
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: cardBg,
                      borderRadius: BorderRadius.circular(22),
                      border: Border.all(color: cardBorder, width: 1.2),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: isDark ? 0.35 : 0.04),
                          blurRadius: isDark ? 10 : 8,
                          offset: const Offset(0, 3),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Container(
                              width: 44,
                              height: 44,
                              decoration: BoxDecoration(
                                color: (wf['color'] as Color).withValues(alpha: 0.14),
                                borderRadius: BorderRadius.circular(14),
                              ),
                              child: Icon(wf['icon'] as IconData, color: wf['color'] as Color, size: 22),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(wf['name'] as String, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: textPrimary)),
                                  const SizedBox(height: 2),
                                  Text('Trigger: ${wf['trigger']}', style: TextStyle(color: textMuted, fontSize: 11)),
                                ],
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: (wf['color'] as Color).withValues(alpha: 0.12),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                wf['status'] as String,
                                style: TextStyle(color: wf['color'] as Color, fontWeight: FontWeight.bold, fontSize: 10),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 14),
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: innerBoxBg,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: cardBorder),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text('Last: ${wf['lastRun']}', style: TextStyle(fontSize: 11, color: textMuted)),
                              Text('Total: ${wf['runs']}', style: TextStyle(fontSize: 11, color: textMuted)),
                              Text('Success: ${wf['success']}',
                                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xff10b981))),
                            ],
                          ),
                        ),
                        const SizedBox(height: 12),
                        SizedBox(
                          width: double.infinity,
                          child: OutlinedButton.icon(
                            onPressed: () => _triggerWorkflow(wf, isDark),
                            icon: const Icon(Icons.play_arrow_rounded, size: 18),
                            label: const Text('Trigger Pipeline Now', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                            style: OutlinedButton.styleFrom(
                              side: BorderSide(color: cardBorder),
                              foregroundColor: textPrimary,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                              padding: const EdgeInsets.symmetric(vertical: 10),
                            ),
                          ),
                        ),
                      ],
                    ),
                  )),
            ],
          ),
        ),
      ),
    );
  }
}
