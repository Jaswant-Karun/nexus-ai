import 'package:flutter/material.dart';

class ProjectDetailsScreen extends StatelessWidget {
  const ProjectDetailsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBg = isDark ? const Color(0xff111827) : Colors.white;
    final cardBorder = isDark ? const Color(0xff1f2937) : const Color(0xffe2e8f0);
    final textPrimary = isDark ? Colors.white : const Color(0xff0f172a);
    final textMuted = isDark ? const Color(0xff94a3b8) : const Color(0xff64748b);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Project Details', style: TextStyle(fontWeight: FontWeight.w800)),
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 600),
          child: ListView(
            padding: const EdgeInsets.fromLTRB(20, 16, 20, 32),
            children: [
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(22),
                  gradient: const LinearGradient(
                    colors: [Color(0xff2457c5), Color(0xff4389ed)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xff2457c5).withValues(alpha: 0.35),
                      blurRadius: 14,
                      offset: const Offset(0, 6),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    Text(
                      'Website Redesign & AI Agents',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 22,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    SizedBox(height: 8),
                    Text(
                      'Universal design system refresh, mobile client unification, and real-time backend API synchronization.',
                      style: TextStyle(
                        color: Color(0xffdfe8ff),
                        fontSize: 13,
                        height: 1.45,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              Text(
                'Overview',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: textPrimary),
              ),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: cardBg,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: cardBorder, width: 1.2),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: isDark ? 0.25 : 0.04),
                      blurRadius: 6,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    _statRow('Progress', '72%', textPrimary, textMuted),
                    _statRow('Owner', 'Jaswant Karun', textPrimary, textMuted),
                    _statRow('Architecture', 'Next.js + FastAPI + Flutter', textPrimary, textMuted),
                    _statRow('Status', 'Active & Synchronized', const Color(0xff10b981), textMuted),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              Text(
                'Milestones',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: textPrimary),
              ),
              const SizedBox(height: 12),
              _milestone('Backend Auth & Tokens API', 'Live on Next.js :3000 and FastAPI :8000', true, cardBg, cardBorder, textPrimary, textMuted, isDark),
              _milestone('Mobile & Web Dark Mode UI', '100% matched Obsidian Dark palette', true, cardBg, cardBorder, textPrimary, textMuted, isDark),
              _milestone('Mobile Token Vault & Scopes', 'Real cryptographic token generation & revocation', true, cardBg, cardBorder, textPrimary, textMuted, isDark),
            ],
          ),
        ),
      ),
    );
  }

  Widget _statRow(String label, String value, Color valueColor, Color textMuted) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(color: textMuted, fontSize: 13)),
          Text(value, style: TextStyle(fontWeight: FontWeight.w700, color: valueColor, fontSize: 13)),
        ],
      ),
    );
  }

  Widget _milestone(String title, String subtitle, bool done, Color cardBg, Color cardBorder, Color textPrimary, Color textMuted, bool isDark) {
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
        children: [
          Container(
            width: 30,
            height: 30,
            decoration: BoxDecoration(
              color: done ? const Color(0xff10b981) : (isDark ? const Color(0xff1f2937) : const Color(0xffe9f0ff)),
              borderRadius: BorderRadius.circular(9),
            ),
            child: Icon(
              done ? Icons.check_rounded : Icons.radio_button_unchecked,
              color: done ? Colors.white : const Color(0xff4f52ea),
              size: 17,
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13.5, color: textPrimary),
                ),
                const SizedBox(height: 3),
                Text(
                  subtitle,
                  style: TextStyle(
                    fontSize: 11.5,
                    color: textMuted,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
