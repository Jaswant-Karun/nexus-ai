import 'package:flutter/material.dart';
import '../../services/workflow_service.dart';

class WorkflowListScreen extends StatefulWidget {
  const WorkflowListScreen({super.key});

  @override
  State<WorkflowListScreen> createState() => _WorkflowListScreenState();
}

class _WorkflowListScreenState extends State<WorkflowListScreen> {
  int _selectedFilter = 0;
  static const _blue = Color(0xff4f52ea);

  final _filters = ['All', 'Active', 'Scheduled', 'Paused'];

  bool _n8nOnline = false;
  bool _preferN8n = true;
  bool _isExecuting = false;

  final _workflows = [
    {
      'id': 'wf-multi-agent',
      'name': 'n8n Multi-Agent Collaboration Pipeline',
      'trigger': 'Webhook (POST /nexus-multi-agent)',
      'status': 'Active',
      'lastRun': 'Just now',
      'runs': '1,420 runs',
      'success': '99.4%',
      'color': Color(0xff4f52ea),
      'icon': Icons.hub_rounded,
      'engine': 'n8n',
    },
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
      'engine': 'nexus',
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
      'engine': 'nexus',
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
      'engine': 'nexus',
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
      'engine': 'nexus',
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
      'engine': 'nexus',
    },
  ];

  @override
  void initState() {
    super.initState();
    _checkHealth();
  }

  void _checkHealth() async {
    final isOnline = await WorkflowService.instance.checkN8nOnline();
    if (mounted) {
      setState(() {
        _n8nOnline = isOnline;
      });
    }
  }

  void _showResultModal(WorkflowExecutionResult res, bool isDark) {
    final cardBg = isDark ? const Color(0xff0e1626) : Colors.white;
    final textPrimary = isDark ? Colors.white : const Color(0xff0f172a);

    showModalBottomSheet(
      context: context,
      backgroundColor: cardBg,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return Padding(
          padding: EdgeInsets.fromLTRB(
            24,
            24,
            24,
            MediaQuery.of(context).viewInsets.bottom + 24,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.check_circle_rounded, color: Color(0xff10b981), size: 22),
                      const SizedBox(width: 8),
                      Text(
                        'Pipeline Execution Success',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: textPrimary),
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: _blue.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      '${res.durationMs}ms',
                      style: const TextStyle(color: _blue, fontWeight: FontWeight.bold, fontSize: 11),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Text(
                'Engine: ${res.engine.toUpperCase()}',
                style: const TextStyle(color: Color(0xff10b981), fontWeight: FontWeight.bold, fontSize: 11),
              ),
              const SizedBox(height: 10),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xff070a12) : const Color(0xfff8fafc),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: isDark ? const Color(0xff1e293b) : const Color(0xffe2e8f0)),
                ),
                child: Text(
                  res.output,
                  style: TextStyle(
                    fontSize: 12,
                    fontFamily: 'monospace',
                    color: textPrimary,
                    height: 1.4,
                  ),
                ),
              ),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: FilledButton(
                  style: FilledButton.styleFrom(backgroundColor: _blue),
                  onPressed: () => Navigator.pop(context),
                  child: const Text('Dismiss'),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  void _triggerWorkflow(Map<String, dynamic> wf, bool isDark) {
    final cardBg = isDark ? const Color(0xff0e1626) : Colors.white;
    final textPrimary = isDark ? Colors.white : const Color(0xff0f172a);
    final textMuted = isDark ? const Color(0xff94a3b8) : const Color(0xff6c7890);

    showModalBottomSheet(
      context: context,
      backgroundColor: cardBg,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setSheetState) {
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
                  const SizedBox(height: 18),

                  // Engine Toggle
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xff070a12) : const Color(0xfff1f5f9),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Execution Engine', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: textPrimary)),
                        Row(
                          children: [
                            ChoiceChip(
                              label: const Text('n8n Webhook', style: TextStyle(fontSize: 11)),
                              selected: _preferN8n,
                              selectedColor: _blue,
                              onSelected: (val) {
                                setSheetState(() => _preferN8n = true);
                                setState(() => _preferN8n = true);
                              },
                            ),
                            const SizedBox(width: 6),
                            ChoiceChip(
                              label: const Text('FastAPI Backend', style: TextStyle(fontSize: 11)),
                              selected: !_preferN8n,
                              selectedColor: _blue,
                              onSelected: (val) {
                                setSheetState(() => _preferN8n = false);
                                setState(() => _preferN8n = false);
                              },
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
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
                          onPressed: _isExecuting
                              ? null
                              : () async {
                                  Navigator.pop(context);
                                  setState(() => _isExecuting = true);

                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(
                                      content: Text('⚡ Dispatching ${wf['name']} via ${_preferN8n ? "n8n Engine" : "FastAPI Backend"}...'),
                                      duration: const Duration(seconds: 2),
                                    ),
                                  );

                                  final result = await WorkflowService.instance.triggerWorkflow(
                                    workflowId: wf['id'] as String,
                                    workflowName: wf['name'] as String,
                                    useN8n: _preferN8n,
                                  );

                                  if (mounted) {
                                    setState(() => _isExecuting = false);
                                    _showResultModal(result, isDark);
                                  }
                                },
                          child: _isExecuting
                              ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                              : const Text('Run Pipeline'),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBg = isDark ? const Color(0xff0e1626) : Colors.white;
    final cardBorder = isDark ? const Color(0xff1e293b) : const Color(0xffe2e8f0);
    final innerBoxBg = isDark ? const Color(0xff070a12) : const Color(0xfff8fafc);
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
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            onPressed: _checkHealth,
            tooltip: 'Refresh Status',
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Visual Canvas DAG Designer is accessible on Web Dashboard.')),
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
              // n8n Engine Status Banner
              Container(
                margin: const EdgeInsets.only(bottom: 16),
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xff111827) : const Color(0xfff0fdf4),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: _n8nOnline ? const Color(0xff10b981) : const Color(0xfff59e0b), width: 1.2),
                ),
                child: Row(
                  children: [
                    Icon(
                      _n8nOnline ? Icons.check_circle_rounded : Icons.sync_problem_rounded,
                      color: _n8nOnline ? const Color(0xff10b981) : const Color(0xfff59e0b),
                      size: 20,
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            _n8nOnline ? 'n8n Automation Engine Online' : 'n8n Engine Standby (Fallback Active)',
                            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: textPrimary),
                          ),
                          Text(
                            _n8nOnline ? 'Connected to port 5678 webhook listener' : 'Autonomous neural failover enabled',
                            style: TextStyle(fontSize: 10, color: textMuted),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

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
                      backgroundColor: isDark ? const Color(0xff0e1626) : const Color(0xfff1f5f9),
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
