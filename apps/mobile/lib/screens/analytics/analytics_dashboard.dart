import 'package:flutter/material.dart';

class AnalyticsDashboardScreen extends StatelessWidget {
  const AnalyticsDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBg = isDark ? const Color(0xff111827) : Colors.white;
    final cardBorder = isDark ? const Color(0xff1f2937) : const Color(0xffe2e8f0);
    final textPrimary = isDark ? Colors.white : const Color(0xff0f172a);
    final textMuted = isDark ? const Color(0xff94a3b8) : const Color(0xff64748b);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Analytics & Intelligence', style: TextStyle(fontWeight: FontWeight.w800)),
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 600),
          child: ListView(
            padding: const EdgeInsets.fromLTRB(20, 16, 20, 32),
            children: [
              Text(
                'Performance Overview',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.w800, color: textPrimary),
              ),
              const SizedBox(height: 18),
              Row(
                children: [
                  Expanded(
                    child: _MetricCard(
                      value: '24.8%',
                      label: 'Conversion Lift',
                      color: const Color(0xff2d6cdf),
                      isDark: isDark,
                      cardBorder: cardBorder,
                      textPrimary: textPrimary,
                      textMuted: textMuted,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _MetricCard(
                      value: '83%',
                      label: 'Model Efficiency',
                      color: const Color(0xff16866b),
                      isDark: isDark,
                      cardBorder: cardBorder,
                      textPrimary: textPrimary,
                      textMuted: textMuted,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 18),
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: cardBg,
                  borderRadius: BorderRadius.circular(20),
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
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Task Velocity (Last 6 Runs)',
                          style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: textPrimary),
                        ),
                        Text('Avg: 72 ms', style: TextStyle(fontSize: 11, color: textMuted)),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        for (final value in [35, 55, 80, 70, 92, 100])
                          Expanded(
                            child: Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 4),
                              child: Align(
                                alignment: Alignment.bottomCenter,
                                child: Container(
                                  height: value.toDouble(),
                                  decoration: BoxDecoration(
                                    color: const Color(0xff4f52ea).withValues(alpha: 0.8),
                                    borderRadius: const BorderRadius.vertical(
                                      top: Radius.circular(8),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              Text(
                'Recent Agent Telemetry Highlights',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: textPrimary),
              ),
              const SizedBox(height: 12),
              _HighlightItem(
                title: 'Launch checklist review',
                value: 'Completed 4 tasks',
                cardBg: cardBg,
                cardBorder: cardBorder,
                textPrimary: textPrimary,
                isDark: isDark,
              ),
              _HighlightItem(
                title: 'Customer support swarm triage',
                value: 'Resolved 12 issues',
                cardBg: cardBg,
                cardBorder: cardBorder,
                textPrimary: textPrimary,
                isDark: isDark,
              ),
              _HighlightItem(
                title: 'Enterprise vector memory sweep',
                value: 'Updated 1 hour ago',
                cardBg: cardBg,
                cardBorder: cardBorder,
                textPrimary: textPrimary,
                isDark: isDark,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _MetricCard extends StatelessWidget {
  const _MetricCard({
    required this.value,
    required this.label,
    required this.color,
    required this.isDark,
    required this.cardBorder,
    required this.textPrimary,
    required this.textMuted,
  });

  final String value;
  final String label;
  final Color color;
  final bool isDark;
  final Color cardBorder;
  final Color textPrimary;
  final Color textMuted;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xff111827) : color.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: isDark ? cardBorder : color.withValues(alpha: 0.2), width: 1.2),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            value,
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.w800, color: color),
          ),
          const SizedBox(height: 6),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              color: textMuted,
            ),
          ),
        ],
      ),
    );
  }
}

class _HighlightItem extends StatelessWidget {
  const _HighlightItem({
    required this.title,
    required this.value,
    required this.cardBg,
    required this.cardBorder,
    required this.textPrimary,
    required this.isDark,
  });

  final String title;
  final String value;
  final Color cardBg;
  final Color cardBorder;
  final Color textPrimary;
  final bool isDark;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: cardBg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: cardBorder, width: 1.2),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: isDark ? 0.25 : 0.04),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(title, style: TextStyle(fontWeight: FontWeight.w600, color: textPrimary, fontSize: 13)),
          Text(value, style: const TextStyle(color: Color(0xff4f52ea), fontWeight: FontWeight.w700, fontSize: 12)),
        ],
      ),
    );
  }
}
