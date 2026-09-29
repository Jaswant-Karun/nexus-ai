import 'package:flutter/material.dart';

class AgentListScreen extends StatefulWidget {
  const AgentListScreen({super.key});

  @override
  State<AgentListScreen> createState() => _AgentListScreenState();
}

class _AgentListScreenState extends State<AgentListScreen> {
  static const _blue = Color(0xff4f52ea);
  String _selectedCategory = 'All';

  final List<Map<String, dynamic>> _agents = [
    {
      'id': 'agent-01',
      'name': 'Supervisor / Orchestrator Agent',
      'role': 'Multi-Agent Router & DAG Execution',
      'category': 'Core',
      'icon': Icons.hub_rounded,
      'color': Color(0xff4f52ea),
      'status': 'Online',
      'tasksCompleted': 1420,
      'description': 'Directs incoming user queries, coordinates multi-agent consensus, and orchestrates workflow execution pipelines.',
    },
    {
      'id': 'agent-02',
      'name': 'Research & Web Retrieval Agent',
      'role': 'Autonomous Knowledge Retrieval',
      'category': 'Research',
      'icon': Icons.travel_explore_rounded,
      'color': Color(0xff06b6d4),
      'status': 'Online',
      'tasksCompleted': 892,
      'description': 'Performs deep web crawls, synthesizes scientific publications, and indexes external documentation into vector store.',
    },
    {
      'id': 'agent-03',
      'name': 'Software Architecture Agent',
      'role': 'System Design & Blueprinting',
      'category': 'Engineering',
      'icon': Icons.architecture_rounded,
      'color': Color(0xff8b5cf6),
      'status': 'Online',
      'tasksCompleted': 654,
      'description': 'Designs high-availability microservice architectures, generates Mermaid diagrams, and creates REST/gRPC API contracts.',
    },
    {
      'id': 'agent-04',
      'name': 'Code Generation Agent',
      'role': 'Polyglot Full-Stack Implementation',
      'category': 'Engineering',
      'icon': Icons.code_rounded,
      'color': Color(0xff10b981),
      'status': 'Online',
      'tasksCompleted': 2130,
      'description': 'Produces clean, typed, modular code in TypeScript, Python, SQL, Rust, and Go with integrated error boundaries.',
    },
    {
      'id': 'agent-05',
      'name': 'Code Reviewer & Security Linter',
      'role': 'AST Analysis & Vulnerability Scanner',
      'category': 'Security',
      'icon': Icons.security_rounded,
      'color': Color(0xffef4444),
      'status': 'Online',
      'tasksCompleted': 974,
      'description': 'Inspects code diffs for OWASP Top 10 vulnerabilities, deadlocks, race conditions, and architectural compliance.',
    },
    {
      'id': 'agent-06',
      'name': 'Performance & Optimization Agent',
      'role': 'Algorithmic Profiling & Scaling',
      'category': 'Engineering',
      'icon': Icons.speed_rounded,
      'color': Color(0xfff59e0b),
      'status': 'Online',
      'tasksCompleted': 430,
      'description': 'Identifies memory leaks, reduces Big-O time complexity, and optimizes database query plans and indexing.',
    },
    {
      'id': 'agent-07',
      'name': 'Database & Vector Model Agent',
      'role': 'Schema Migrations & Vector Embeddings',
      'category': 'Data',
      'icon': Icons.storage_rounded,
      'color': Color(0xff3b82f6),
      'status': 'Online',
      'tasksCompleted': 812,
      'description': 'Manages PostgreSQL relational models, Qdrant vector collections, and hybrid dense/sparse search indexing.',
    },
    {
      'id': 'agent-08',
      'name': 'DevOps & Container Agent',
      'role': 'Docker, Kubernetes & CI/CD Pipelines',
      'category': 'DevOps',
      'icon': Icons.cloud_done_rounded,
      'color': Color(0xff14b8a6),
      'status': 'Online',
      'tasksCompleted': 756,
      'description': 'Configures multi-stage Docker builds, Kubernetes manifests, health checks, and zero-downtime rolling deployments.',
    },
    {
      'id': 'agent-09',
      'name': 'QA & Automated Testing Agent',
      'role': 'Unit, Integration & E2E Validation',
      'category': 'Testing',
      'icon': Icons.fact_check_rounded,
      'color': Color(0xffec4899),
      'status': 'Online',
      'tasksCompleted': 1180,
      'description': 'Generates unit tests, mock fixtures, edge-case test suites, and regression checks across packages.',
    },
    {
      'id': 'agent-10',
      'name': 'Documentation & Technical Writer',
      'role': 'Markdown & OpenAPI Specification',
      'category': 'Documentation',
      'icon': Icons.menu_book_rounded,
      'color': Color(0xffa855f7),
      'status': 'Online',
      'tasksCompleted': 620,
      'description': 'Documents API endpoints, architectural decisions records (ADRs), user manuals, and system setup guides.',
    },
    {
      'id': 'agent-11',
      'name': 'Data Analytics & Forecasting Agent',
      'role': 'Statistical Models & KPI Aggregates',
      'category': 'Data',
      'icon': Icons.insights_rounded,
      'color': Color(0xffeab308),
      'status': 'Online',
      'tasksCompleted': 489,
      'description': 'Computes retention metrics, predictive churn models, resource utilization rates, and operational telemetry.',
    },
    {
      'id': 'agent-12',
      'name': 'n8n Automation Orchestrator',
      'role': 'Webhook Triggers & Workflow Sync',
      'category': 'Core',
      'icon': Icons.account_tree_rounded,
      'color': Color(0xffea580c),
      'status': 'Online',
      'tasksCompleted': 1340,
      'description': 'Connects visual n8n workflow canvas nodes with local AI agents, webhook endpoints, and notifications.',
    },
    {
      'id': 'agent-13',
      'name': 'Compliance & Policy Auditor',
      'role': 'GDPR, HIPAA & Audit Trail Enforcer',
      'category': 'Security',
      'icon': Icons.verified_user_rounded,
      'color': Color(0xff0284c7),
      'status': 'Online',
      'tasksCompleted': 340,
      'description': 'Maintains tamper-proof activity logs, redacts PII data, and guarantees SOC2 / GDPR policy enforcement.',
    },
    {
      'id': 'agent-14',
      'name': 'Knowledge Graph Synthesizer',
      'role': 'Semantic Entities & Relational Edges',
      'category': 'Data',
      'icon': Icons.auto_awesome_mosaic_rounded,
      'color': Color(0xff6366f1),
      'status': 'Online',
      'tasksCompleted': 570,
      'description': 'Builds dynamic multi-hop entity graphs connecting documents, projects, agents, and user queries.',
    },
  ];

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBg = isDark ? const Color(0xff0e1626) : Colors.white;
    final cardBorder = isDark ? const Color(0xff1e293b) : const Color(0xffe2e8f0);
    final textPrimary = isDark ? Colors.white : const Color(0xff0f172a);
    final textMuted = isDark ? const Color(0xff94a3b8) : const Color(0xff64748b);

    final categories = ['All', 'Core', 'Engineering', 'Security', 'Data', 'DevOps', 'Testing'];
    final filteredAgents = _selectedCategory == 'All'
        ? _agents
        : _agents.where((a) => a['category'] == _selectedCategory).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('14 Autonomous AI Agents', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 17)),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: const Color(0xff10b981).withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Row(
              children: [
                Icon(Icons.check_circle_rounded, color: Color(0xff10b981), size: 14),
                SizedBox(width: 4),
                Text('All Active', style: TextStyle(color: Color(0xff10b981), fontSize: 11, fontWeight: FontWeight.bold)),
              ],
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Category Filter Bar
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: categories.map((cat) {
                    final isSel = cat == _selectedCategory;
                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: FilterChip(
                        label: Text(cat),
                        selected: isSel,
                        onSelected: (_) => setState(() => _selectedCategory = cat),
                        selectedColor: _blue,
                        labelStyle: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: isSel ? Colors.white : textMuted,
                        ),
                        backgroundColor: cardBg,
                        side: BorderSide(color: isSel ? _blue : cardBorder),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                    );
                  }).toList(),
                ),
              ),
            ),

            // Agents List
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                itemCount: filteredAgents.length,
                itemBuilder: (context, index) {
                  final a = filteredAgents[index];
                  final Color color = a['color'] as Color;
                  return Container(
                    margin: const EdgeInsets.only(bottom: 14),
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: cardBg,
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(color: cardBorder, width: 1.2),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: isDark ? 0.3 : 0.03),
                          blurRadius: 8,
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
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                color: color.withValues(alpha: 0.15),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Icon(a['icon'] as IconData, color: color, size: 22),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    a['name'] as String,
                                    style: TextStyle(
                                      fontSize: 14.5,
                                      fontWeight: FontWeight.w800,
                                      color: textPrimary,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    a['role'] as String,
                                    style: TextStyle(fontSize: 11, color: color, fontWeight: FontWeight.bold),
                                  ),
                                ],
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: const Color(0xff10b981).withValues(alpha: 0.12),
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: Text(
                                a['status'] as String,
                                style: const TextStyle(
                                  color: Color(0xff10b981),
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        Text(
                          a['description'] as String,
                          style: TextStyle(fontSize: 12, color: textMuted, height: 1.4),
                        ),
                        const SizedBox(height: 12),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              '${a['tasksCompleted']} operations completed',
                              style: TextStyle(fontSize: 11, color: textMuted, fontWeight: FontWeight.w500),
                            ),
                            FilledButton.tonal(
                              style: FilledButton.styleFrom(
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                              ),
                              onPressed: () {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text('${a['name']} ready for local task allocation!'),
                                    duration: const Duration(seconds: 1),
                                  ),
                                );
                              },
                              child: const Text('Engage Agent', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                            ),
                          ],
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
