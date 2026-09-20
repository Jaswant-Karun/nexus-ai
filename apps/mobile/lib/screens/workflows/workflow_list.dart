import 'package:flutter/material.dart';

class WorkflowListScreen extends StatelessWidget {
  const WorkflowListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final workflows = [
      _WorkflowItem(
        name: 'Lead qualification',
        status: 'Running',
        detail: 'Scoring and routing new leads',
      ),
      _WorkflowItem(
        name: 'Content Publisher',
        status: 'Queued',
        detail: 'Drafting social and email content',
      ),
      _WorkflowItem(
        name: 'Research synthesis',
        status: 'Completed',
        detail: 'Summarized 18 sources into themes',
      ),
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Workflows'),
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 32),
        children: [
          const Text(
            'Automation library',
            style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 8),
          const Text(
            'Keep your AI operations coordinated and measurable.',
            style: TextStyle(color: Color(0xff6c7890)),
          ),
          const SizedBox(height: 18),
          ...workflows.map((workflow) => Container(
                margin: const EdgeInsets.only(bottom: 14),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Theme.of(context).cardColor,
                  borderRadius: BorderRadius.circular(18),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 42,
                      height: 42,
                      decoration: BoxDecoration(
                        color: workflow.status == 'Completed'
                            ? const Color(0xff16866b).withValues(alpha: 0.12)
                            : const Color(0xff2d6cdf).withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(
                        workflow.status == 'Completed'
                            ? Icons.check_circle_rounded
                            : Icons.account_tree_rounded,
                        color: workflow.status == 'Completed'
                            ? const Color(0xff16866b)
                            : const Color(0xff2d6cdf),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            workflow.name,
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            workflow.detail,
                            style: const TextStyle(
                              color: Color(0xff6c7890),
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                      decoration: BoxDecoration(
                        color: workflow.status == 'Completed'
                            ? const Color(0xff16866b).withValues(alpha: 0.12)
                            : const Color(0xff2d6cdf).withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(999),
                      ),
                      child: Text(
                        workflow.status,
                        style: TextStyle(
                          color: workflow.status == 'Completed'
                              ? const Color(0xff16866b)
                              : const Color(0xff2d6cdf),
                          fontWeight: FontWeight.w700,
                          fontSize: 11,
                        ),
                      ),
                    ),
                  ],
                ),
              )),
        ],
      ),
    );
  }
}

class _WorkflowItem {
  const _WorkflowItem({
    required this.name,
    required this.status,
    required this.detail,
  });

  final String name;
  final String status;
  final String detail;
}
