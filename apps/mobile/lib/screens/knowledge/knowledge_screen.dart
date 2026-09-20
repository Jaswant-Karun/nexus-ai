import 'package:flutter/material.dart';

class KnowledgeScreen extends StatefulWidget {
  const KnowledgeScreen({super.key});

  @override
  State<KnowledgeScreen> createState() => _KnowledgeScreenState();
}

class _KnowledgeScreenState extends State<KnowledgeScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final _searchController = TextEditingController();
  static const _blue = Color(0xff2d6cdf);

  final _indexedDocs = [
    {
      'title': 'Enterprise Security Policy & Architecture',
      'chunks': '142 chunks',
      'type': 'PDF',
      'size': '4.2 MB',
      'score': '99.4% match',
      'updated': 'Updated 2h ago',
    },
    {
      'title': 'Nexus AI Autonomous Agent Protocols',
      'chunks': '88 chunks',
      'type': 'DOCX',
      'size': '1.8 MB',
      'score': '98.1% match',
      'updated': 'Updated Yesterday',
    },
    {
      'title': 'PostgreSQL & Qdrant Hybrid RAG Schema',
      'chunks': '64 chunks',
      'type': 'MD',
      'size': '850 KB',
      'score': '96.5% match',
      'updated': 'Updated 3 days ago',
    },
    {
      'title': 'Workflow Automation Triggers & Actions API',
      'chunks': '110 chunks',
      'type': 'PDF',
      'size': '3.1 MB',
      'score': '94.8% match',
      'updated': 'Updated 5 days ago',
    },
  ];

  final _storageFiles = [
    {
      'name': 'Q3_Financial_Projections_Report.pdf',
      'ocrStatus': 'OCR Completed',
      'summary': 'Revenue grew by 28% quarter-over-quarter driven by enterprise agent subscriptions.',
      'size': '2.4 MB',
      'icon': Icons.picture_as_pdf_rounded,
      'color': Color(0xffef4444),
    },
    {
      'name': 'Employee_Onboarding_Handbook.docx',
      'ocrStatus': 'Text Indexed',
      'summary': 'Standard operating procedures, SSO setup, and zero-trust security guidelines.',
      'size': '1.1 MB',
      'icon': Icons.description_rounded,
      'color': Color(0xff3b82f6),
    },
    {
      'name': 'AWS_Architecture_Diagram_Scanned.png',
      'ocrStatus': 'Vision OCR 100%',
      'summary': 'VPC multi-region setup with Redis clusters, PostgreSQL replica, and gateway.',
      'size': '4.8 MB',
      'icon': Icons.image_rounded,
      'color': Color(0xff10b981),
    },
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Knowledge & Storage', style: TextStyle(fontWeight: FontWeight.w800)),
        bottom: TabBar(
          controller: _tabController,
          labelColor: _blue,
          unselectedLabelColor: const Color(0xff6c7890),
          indicatorColor: _blue,
          tabs: const [
            Tab(icon: Icon(Icons.psychology_rounded), text: 'Knowledge RAG'),
            Tab(icon: Icon(Icons.cloud_done_rounded), text: 'Smart Storage'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _knowledgeTab(isDark),
          _storageTab(isDark),
        ],
      ),
    );
  }

  Widget _knowledgeTab(bool isDark) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 32),
      children: [
        // Search bar
        TextField(
          controller: _searchController,
          decoration: InputDecoration(
            hintText: 'Search semantic vector memory...',
            prefixIcon: const Icon(Icons.search_rounded, color: _blue),
            filled: true,
            fillColor: Theme.of(context).cardColor,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: BorderSide(color: isDark ? const Color(0xff1f293d) : const Color(0xffe2e8f0)),
            ),
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          ),
        ),
        const SizedBox(height: 16),

        // Memory metrics strip
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: _blue.withValues(alpha: 0.08),
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: _blue.withValues(alpha: 0.2)),
          ),
          child: const Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _StatItem('14.8M', 'Vector Tokens'),
              _StatItem('404', 'Indexed Chunks'),
              _StatItem('< 1.2ms', 'Retrieval Latency'),
            ],
          ),
        ),
        const SizedBox(height: 20),

        const Text('Indexed Knowledge Documents', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        const SizedBox(height: 12),

        ..._indexedDocs.map((doc) => Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Theme.of(context).cardColor,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: isDark ? const Color(0xff1f293d) : const Color(0xffe2e8f0)),
              ),
              child: Row(
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      color: const Color(0xff06b6d4).withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.article_rounded, color: Color(0xff06b6d4)),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(doc['title']!, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                        const SizedBox(height: 3),
                        Text('${doc['chunks']} • ${doc['size']} • ${doc['updated']}',
                            style: const TextStyle(color: Color(0xff6c7890), fontSize: 11)),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: const Color(0xff10b981).withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(doc['score']!,
                        style: const TextStyle(color: Color(0xff047857), fontWeight: FontWeight.bold, fontSize: 10)),
                  ),
                ],
              ),
            )),
      ],
    );
  }

  Widget _storageTab(bool isDark) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 32),
      children: [
        // Upload Action Button
        FilledButton.icon(
          onPressed: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('File uploaded and queued for automated OCR text extraction & vector indexing.')),
            );
          },
          icon: const Icon(Icons.upload_file_rounded),
          label: const Text('Upload Document / Image'),
          style: FilledButton.styleFrom(
            backgroundColor: _blue,
            padding: const EdgeInsets.symmetric(vertical: 14),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          ),
        ),
        const SizedBox(height: 20),

        const Text('Smart OCR & Extracted Files', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        const SizedBox(height: 12),

        ..._storageFiles.map((f) => Container(
              margin: const EdgeInsets.only(bottom: 14),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Theme.of(context).cardColor,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: isDark ? const Color(0xff1f293d) : const Color(0xffe2e8f0)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(f['icon'] as IconData, color: f['color'] as Color, size: 28),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(f['name'] as String, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                            Text(f['size'] as String, style: const TextStyle(color: Color(0xff6c7890), fontSize: 11)),
                          ],
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: const Color(0xff10b981).withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(f['ocrStatus'] as String,
                            style: const TextStyle(color: Color(0xff047857), fontWeight: FontWeight.bold, fontSize: 10)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xff111827) : const Color(0xfff8fafc),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('🤖 ', style: TextStyle(fontSize: 12)),
                        Expanded(
                          child: Text(
                            f['summary'] as String,
                            style: const TextStyle(fontSize: 11, height: 1.3, color: Color(0xff6c7890)),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            )),
      ],
    );
  }
}

class _StatItem extends StatelessWidget {
  final String val;
  final String label;
  const _StatItem(this.val, this.label);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(val, style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w900, color: Color(0xff2d6cdf))),
        const SizedBox(height: 2),
        Text(label, style: const TextStyle(fontSize: 10, color: Color(0xff6c7890))),
      ],
    );
  }
}
