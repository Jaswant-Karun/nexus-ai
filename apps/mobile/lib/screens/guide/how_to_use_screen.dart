import 'package:flutter/material.dart';

class HowToUseScreen extends StatefulWidget {
  const HowToUseScreen({super.key});

  @override
  State<HowToUseScreen> createState() => _HowToUseScreenState();
}

class _HowToUseScreenState extends State<HowToUseScreen> {
  bool _isTamil = false;
  int _selectedCategory = 0;

  static const _blue = Color(0xff2d6cdf);

  final _categoriesEn = ['All', 'AI Agents', 'Workflows', 'Knowledge', 'Storage', 'Settings'];
  final _categoriesTa = ['அனைத்தும்', 'AI முகவர்கள்', 'பணிப்பாய்வுகள்', 'அறிவுத்தளம்', 'சேமிப்பகம்', 'அமைப்புகள்'];

  final _guides = [
    {
      'icon': Icons.smart_toy_rounded,
      'color': const Color(0xff4f52ea),
      'badgeEn': 'Core Intelligence',
      'badgeTa': 'முக்கிய நுண்ணறிவு',
      'titleEn': 'Autonomous AI Agents & Multi-Model Chat',
      'titleTa': 'தன்னாட்சி AI முகவர்கள் மற்றும் பல்வகை அரட்டை',
      'descEn': 'Route questions to GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro, and local LLaMA with persistent memory and tool execution.',
      'descTa': 'GPT-4o, Claude 3.5, Gemini மற்றும் LLaMA போன்ற முன்னணி மாதிரிகளுடன் இணைய தேடல் மற்றும் நினைவகத்துடன் உரையாடுங்கள்.',
      'stepsEn': [
        'Tap the "AI Chat" tab at the bottom of your screen.',
        'Choose your AI model from the top chips (GPT-4o, Claude, Gemini).',
        'Type your question or use slash templates for quick prompts.',
        'Toggle tools like Web Search or Code Execution for real-time answers.',
      ],
      'stepsTa': [
        'கீழ் மெனுவில் உள்ள "AI Chat" பகுதியை அழுத்தவும்.',
        'மேலே உள்ள மாடல் தேர்வியில் உங்களுக்கு தேவையான AI மாடலை தேர்ந்தெடுக்கவும்.',
        'உங்கள் வினவலை தட்டச்சு செய்யவும் அல்லது மாதிரி குறிப்புகளைப் பயன்படுத்தவும்.',
        'நிகழ்நேர தகவல்களுக்கு Web Search அல்லது Code Execution-ஐ இயக்கவும்.',
      ],
      'tipEn': 'Tap any suggested chip above the input box for instant technical analysis.',
      'tipTa': 'உடனடி ஆய்வுக்கு இன்புட் பாக்ஸிற்கு மேலே உள்ள பரிந்துரைக்கப்பட்ட சிப்ஸ்களை அழுத்தவும்.',
    },
    {
      'icon': Icons.account_tree_rounded,
      'color': const Color(0xff9333ea),
      'badgeEn': 'Automation Canvas',
      'badgeTa': 'பணிப்பாய்வு தானியக்கம்',
      'titleEn': 'Visual Workflow Automation & Pipelines',
      'titleTa': 'காட்சிப் பணிப்பாய்வு மற்றும் தானியங்கி குழாய்த்தொடர்',
      'descEn': 'Connect triggers, webhooks, and AI agent steps without writing code to automate enterprise processes.',
      'descTa': 'எந்தவித கோடிங்கும் இல்லாமல் வெப்ஹூக் மற்றும் AI முகவர்களை இணைத்து பணிகளை தானியக்கமாக்குங்கள்.',
      'stepsEn': [
        'Open the "Workflows" tab from the bottom navigation.',
        'Browse active automated pipelines or tap "+" to initiate a workflow.',
        'Inspect trigger events (Schedule, Webhook, File Upload).',
        'Tap "Run Now" to test execution payload and view live status logs.',
      ],
      'stepsTa': [
        'கீழ் மெனுவிலிருந்து "Workflows" பகுதிக்கு செல்லவும்.',
        'இயங்கும் பணிப்பாய்வுகளைக் காண்க அல்லது புதியதை உருவாக்க "+" அழுத்தவும்.',
        'தூண்டுதல் நிகழ்வுகளை (Webhook, Schedule) சரிபார்க்கவும்.',
        '"Run Now" அழுத்தி நிகழ்நேர செயலாக்கத்தை சோதிக்கவும்.',
      ],
      'tipEn': 'Set up Webhooks to automatically trigger notifications to Slack or Email.',
      'tipTa': 'ஸ்லாக் அல்லது மின்னஞ்சலுக்கு தானியங்கி எச்சரிக்கைகள் அனுப்ப வெப்ஹூக்குகளைப் பயன்படுத்தவும்.',
    },
    {
      'icon': Icons.psychology_rounded,
      'color': const Color(0xff06b6d4),
      'badgeEn': 'Hybrid RAG',
      'badgeTa': 'அறிவு மற்றும் நினைவகம்',
      'titleEn': 'Adaptive Knowledge Base & Vector Memory',
      'titleTa': 'தகவமைப்பு அறிவுத்தளம் மற்றும் வெக்டார் மெமரி',
      'descEn': 'Sub-millisecond hybrid vector retrieval (BM25 + Qdrant dense embeddings) for grounded document citations.',
      'descTa': 'உங்கள் நிறுவன ஆவணங்களை உடனடியாக தேடி துல்லியமான ஆதாரங்களை வழங்கும் வெக்டார் RAG அமைப்பு.',
      'stepsEn': [
        'Navigate to the "Knowledge" tab in bottom navigation.',
        'Search across indexed documentation in natural language.',
        'Inspect semantic chunks, relevance score, and source documents.',
        'Ask agents to cite specific policies or manuals during chats.',
      ],
      'stepsTa': [
        'கீழ் மெனுவில் "Knowledge" பகுதிக்கு செல்லவும்.',
        'பதிவேற்றப்பட்ட ஆவணங்களில் உங்கள் சொந்த மொழியில் தேடவும்.',
        'ஆவணத்தின் பகுதிகள் மற்றும் பொருத்தமான ஆதாரங்களை காண்க.',
        'உரையாடலின் போது ஆவணங்களிலிருந்து துல்லியமான மேற்கோள்களைப் பெறுங்கள்.',
      ],
      'tipEn': 'Upload technical manuals or PDFs to make them instantly searchable by all agents.',
      'tipTa': 'வழிகாட்டிகள் அல்லது PDF-களை பதிவேற்றி அனைத்து முகவர்களுக்கும் தேடக்கூடியதாக மாற்றவும்.',
    },
    {
      'icon': Icons.cloud_done_rounded,
      'color': const Color(0xff10b981),
      'badgeEn': 'Smart Storage',
      'badgeTa': 'அறிவார்ந்த சேமிப்பகம்',
      'titleEn': 'Smart File Storage & Automated OCR',
      'titleTa': 'ஸ்மார்ட் கோப்பு சேமிப்பகம் மற்றும் தானியங்கி OCR',
      'descEn': 'Upload PDFs, documents, and images with automatic text extraction, summaries, and encryption.',
      'descTa': 'PDF, படங்கள் மற்றும் ஆவணங்களை பதிவேற்றி தானியங்கி உரை பிரித்தெடுத்தல் மற்றும் சுருக்கங்களை பெறுங்கள்.',
      'stepsEn': [
        'Go to "Knowledge & Storage" and tap the "Files" tab.',
        'View recently indexed files with automated AI summaries.',
        'Tap any document to view extracted text, tables, and hash.',
        'Filter by category: Reports, Technical Specs, Invoices.',
      ],
      'stepsTa': [
        '"Knowledge & Storage" சென்று "Files" பகுதியை அழுத்தவும்.',
        'AI உருவாக்கிய தானியங்கி சுருக்கங்களுடன் சமீபத்திய கோப்புகளைக் காண்க.',
        'எந்தவொரு கோப்பையும் தொட்டு உரை மற்றும் அட்டவணைகளைப் பார்க்கவும்.',
        'பிரிவுகளின் அடிப்படையில் கோப்புகளை வடிகட்டி எளிதாக கண்டறியவும்.',
      ],
      'tipEn': 'Scanned invoices are automatically OCR-parsed into structured information.',
      'tipTa': 'ஸ்கேன் செய்யப்பட்ட பில்கள் தானாகவே உரை வடிவமாக மாற்றப்பட்டு துல்லியமாக சேமிக்கப்படும்.',
    },
    {
      'icon': Icons.insights_rounded,
      'color': const Color(0xfff59e0b),
      'badgeEn': 'Real-time Telemetry',
      'badgeTa': 'நிகழ்நேர பகுப்பாய்வு',
      'titleEn': 'Real-Time Telemetry & Token Analytics',
      'titleTa': 'நிகழ்நேர தொலை அளவியல் மற்றும் பயன்பாட்டு கண்காணிப்பு',
      'descEn': 'Monitor token consumption across models, request latencies, and execution costs live.',
      'descTa': 'டோக்கன் பயன்பாடு, செலவு, AI வேகம் மற்றும் கணினி இயக்க நிலையை நேரலையாக கண்காணிக்கவும்.',
      'stepsEn': [
        'Access "Analytics" from the Home dashboard quick actions.',
        'Review token trends for GPT-4o, Claude 3.5, and Gemini.',
        'Check system uptime (99.99%) and average latency (280ms).',
        'Monitor monthly budget utilization to prevent quota exhaustion.',
      ],
      'stepsTa': [
        'முகப்புப் பக்கத்தின் Quick Actions-லிருந்து "Analytics" செல்லவும்.',
        'GPT-4o, Claude மற்றும் Gemini-ன் டோக்கன் பயன்பாட்டு வரைபடங்களை காண்க.',
        'கணினி வேகம் (280ms) மற்றும் இயக்க நிலையை சரிபார்க்கவும்.',
        'ஒதுக்கீட்டு வரம்புகளை கண்காணிக்கவும்.',
      ],
      'tipEn': 'Local LLaMA 3.1 inference runs at zero token cost via on-device/local server.',
      'tipTa': 'உள்ளூர் LLaMA மாதிரிக்கு டோக்கன் கட்டணம் எதுவும் இல்லை.',
    },
    {
      'icon': Icons.tune_rounded,
      'color': const Color(0xffec4899),
      'badgeEn': 'Customization',
      'badgeTa': 'தனிப்பயனாக்கம்',
      'titleEn': 'Theme Controls, AI Persona & Security',
      'titleTa': 'விருப்பத் தோற்றம், AI ஆளுமை மற்றும் பாதுகாப்பு',
      'descEn': 'Toggle Light/Dark mode, customize your Personal AI Co-Pilot, and manage biometric security.',
      'descTa': 'Light/Dark Mode-க்கு மாறவும், தனிப்பட்ட AI துணைவரை வடிவமைக்கவும், கைரேகை பாதுகாப்பை இயக்கவும்.',
      'stepsEn': [
        'Tap the "Profile" tab in the bottom navigation bar.',
        'Choose an Avatar Archetype (Architect, Synthesizer, Quantum, Sentinel).',
        'Customize your Personal AI Co-Pilot codename and reasoning tone.',
        'Toggle Light Mode or Dark Mode for optimal eye comfort.',
      ],
      'stepsTa': [
        'கீழ் மெனுவில் உள்ள "Profile" பகுதியை அழுத்தவும்.',
        'உங்களுக்கு பிடித்த அவதாரத்தை (Architect, Synthesizer, Sentinel) தேர்வு செய்யவும்.',
        'உங்கள் AI உதவியாளரின் பெயர் மற்றும் இயல்புகளை தனிப்பயனாக்கவும்.',
        'கண்களுக்கு இதமான Light Mode அல்லது Dark Mode-ஐ தேர்வு செய்யவும்.',
      ],
      'tipEn': 'Use Light mode during bright daytime and Dark mode for late evening focus.',
      'tipTa': 'பகல் நேரங்களில் Light Mode-ம், இரவு நேரங்களில் Dark Mode-ம் பயன்படுத்தவும்.',
    },
  ];

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          _isTamil ? 'தள வழிகாட்டி' : 'Platform Guide',
          style: const TextStyle(fontWeight: FontWeight.w800),
        ),
        actions: [
          // Dedicated Bilingual Language Switcher (English + Tamil)
          Container(
            margin: const EdgeInsets.only(right: 14),
            padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xff1f293d) : const Color(0xffe8edf8),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                _langButton('🇬🇧 EN', !_isTamil, () => setState(() => _isTamil = false)),
                _langButton('🇮🇳 தமிழ்', _isTamil, () => setState(() => _isTamil = true)),
              ],
            ),
          ),
        ],
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 600),
          child: ListView(
            padding: const EdgeInsets.fromLTRB(20, 12, 20, 32),
            children: [
          // Hero Banner
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(24),
              gradient: const LinearGradient(
                colors: [Color(0xff4341cf), Color(0xff6272f5)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xff4f52ea).withValues(alpha: 0.3),
                  blurRadius: 16,
                  offset: const Offset(0, 6),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    _isTamil ? '📖 முழுமையான வழிகாட்டி' : '📖 Official Guide',
                    style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  _isTamil
                      ? 'Nexus AI-ஐ எவ்வாறு முழுமையாக பயன்படுத்துவது?'
                      : 'How to Master Nexus AI on Mobile',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 22,
                    fontWeight: FontWeight.w900,
                    height: 1.2,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  _isTamil
                      ? 'ஒவ்வொரு முக்கிய அம்சத்தையும் எளிதாக பயன்படுத்த உதவும் விரிவான தமிழ் மற்றும் ஆங்கில வழிகாட்டி.'
                      : 'A comprehensive step-by-step breakdown of every feature — from autonomous agents and workflows to memory RAG.',
                  style: const TextStyle(color: Color(0xffe0e9ff), fontSize: 13, height: 1.4),
                ),
              ],
            ),
          ),
          const SizedBox(height: 22),

          // 4-Step Quick Launch Card
          Text(
            _isTamil ? '🚀 4 எளிய படிகளில் விரைவுத் தொடக்கம்' : '🚀 Quick Start in 4 Simple Steps',
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xff111827) : Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: isDark ? const Color(0xff1f2937) : const Color(0xffe2e8f0), width: 1.2),
              boxShadow: isDark
                  ? [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.35),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ]
                  : [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.04),
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ],
            ),
            child: Column(
              children: [
                _roadmapItem(
                  '1',
                  _isTamil ? 'கணக்கு தொடங்குதல்' : 'Create Account & Theme',
                  _isTamil ? 'உங்கள் விருப்பத்திற்கேற்ப Light/Dark Mode-ஐ அமைக்கவும்.' : 'Sign in and choose between Light or Dark Mode in Settings.',
                  Icons.person_pin_circle_rounded,
                  const Color(0xff4f52ea),
                ),
                const Divider(height: 20),
                _roadmapItem(
                  '2',
                  _isTamil ? 'ஆவணங்களை ஏற்றுதல்' : 'Upload Knowledge Documents',
                  _isTamil ? 'PDF அல்லது கோப்புகளை பதிவேற்றி அறிவுத்தளத்தை உருவாக்கவும்.' : 'Drop PDFs or manuals into Storage to build semantic embeddings.',
                  Icons.upload_file_rounded,
                  const Color(0xff06b6d4),
                ),
                const Divider(height: 20),
                _roadmapItem(
                  '3',
                  _isTamil ? 'AI-யுடன் உரையாடுதல்' : 'Chat with Multi-Model Agents',
                  _isTamil ? 'GPT-4o மற்றும் Claude மூலம் உங்கள் ஆவணங்களிலிருந்து பதில்களைப் பெறுங்கள்.' : 'Ask questions and execute code with persistent conversation memory.',
                  Icons.smart_toy_rounded,
                  const Color(0xff9333ea),
                ),
                const Divider(height: 20),
                _roadmapItem(
                  '4',
                  _isTamil ? 'பணிப்பாய்வை இயக்குதல்' : 'Automate with Workflows',
                  _isTamil ? 'வெப்ஹூக்குகளை இணைத்து பணிகளை முழுமையாக தானியக்கமாக்கவும்.' : 'Trigger multi-agent pipelines on webhooks or schedules.',
                  Icons.bolt_rounded,
                  const Color(0xff10b981),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Categories Filter
          SizedBox(
            height: 38,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: _categoriesEn.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (context, idx) {
                final isSelected = _selectedCategory == idx;
                return ChoiceChip(
                  label: Text(_isTamil ? _categoriesTa[idx] : _categoriesEn[idx]),
                  selected: isSelected,
                  selectedColor: _blue,
                  labelStyle: TextStyle(
                    color: isSelected ? Colors.white : null,
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                  ),
                  onSelected: (_) => setState(() => _selectedCategory = idx),
                );
              },
            ),
          ),
          const SizedBox(height: 18),

          // Detailed Feature Guides List
          ..._filteredGuides().map((item) => _guideCard(context, item, isDark)),
        ],
      ),
    ),
  ),
);
  }

  List<Map<String, dynamic>> _filteredGuides() {
    if (_selectedCategory == 0) return _guides;
    if (_selectedCategory == 1) return [_guides[0]];
    if (_selectedCategory == 2) return [_guides[1]];
    if (_selectedCategory == 3) return [_guides[2]];
    if (_selectedCategory == 4) return [_guides[3]];
    if (_selectedCategory == 5) return [_guides[5]];
    return _guides;
  }

  Widget _langButton(String text, bool active, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        decoration: BoxDecoration(
          color: active ? _blue : Colors.transparent,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Text(
          text,
          style: TextStyle(
            color: active ? Colors.white : null,
            fontSize: 11,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }

  Widget _roadmapItem(String num, String title, String desc, IconData icon, Color color) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 32,
          height: 32,
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.15),
            shape: BoxShape.circle,
          ),
          child: Center(
            child: Text(num, style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 13)),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
              const SizedBox(height: 2),
              Text(desc, style: const TextStyle(color: Color(0xff6c7890), fontSize: 11, height: 1.3)),
            ],
          ),
        ),
      ],
    );
  }

  Widget _guideCard(BuildContext context, Map<String, dynamic> item, bool isDark) {
    final Color color = item['color'] as Color;
    final List<String> steps = _isTamil ? (item['stepsTa'] as List<String>) : (item['stepsEn'] as List<String>);

    final cardBg = isDark ? const Color(0xff111827) : Colors.white;
    final cardBorder = isDark ? const Color(0xff1f2937) : const Color(0xffe2e8f0);
    final textPrimary = isDark ? Colors.white : const Color(0xff0f172a);
    final textMuted = isDark ? const Color(0xff94a3b8) : const Color(0xff64748b);

    return Container(
      margin: const EdgeInsets.only(bottom: 18),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: cardBg,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: cardBorder, width: 1.2),
        boxShadow: isDark
            ? [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.35),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ]
            : [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.04),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
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
                  color: color.withValues(alpha: isDark ? 0.2 : 0.14),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Icon(item['icon'] as IconData, color: color, size: 22),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: color.withValues(alpha: isDark ? 0.2 : 0.12),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        _isTamil ? item['badgeTa'] as String : item['badgeEn'] as String,
                        style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.bold),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      _isTamil ? item['titleTa'] as String : item['titleEn'] as String,
                      style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: textPrimary),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            _isTamil ? item['descTa'] as String : item['descEn'] as String,
            style: TextStyle(fontSize: 12, height: 1.4, color: textMuted),
          ),
          const SizedBox(height: 14),

          // Steps list
          Text(
            _isTamil ? 'படிப்படியான வழிகாட்டி:' : 'Step-by-Step Instructions:',
            style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: textPrimary),
          ),
          const SizedBox(height: 8),
          ...steps.asMap().entries.map((e) => Padding(
                padding: const EdgeInsets.only(bottom: 6),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      margin: const EdgeInsets.only(top: 2),
                      width: 18,
                      height: 18,
                      decoration: BoxDecoration(
                        color: _blue.withValues(alpha: isDark ? 0.25 : 0.12),
                        shape: BoxShape.circle,
                      ),
                      child: Center(
                        child: Text(
                          '${e.key + 1}',
                          style: const TextStyle(color: _blue, fontSize: 10, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(e.value, style: TextStyle(fontSize: 12, height: 1.35, color: textPrimary)),
                    ),
                  ],
                ),
              )),

          const SizedBox(height: 10),
          // Tip banner
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: isDark
                  ? const Color(0xff064e3b).withValues(alpha: 0.25)
                  : const Color(0xff10b981).withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(
                color: isDark
                    ? const Color(0xff059669).withValues(alpha: 0.4)
                    : const Color(0xff10b981).withValues(alpha: 0.25),
              ),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('💡', style: TextStyle(fontSize: 14)),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    '${_isTamil ? "சிறப்பு குறிப்பு: " : "Pro Tip: "}${_isTamil ? item['tipTa'] : item['tipEn']}',
                    style: TextStyle(
                      fontSize: 11,
                      color: isDark ? const Color(0xff6ee7b7) : const Color(0xff047857),
                      fontWeight: FontWeight.w600,
                      height: 1.3,
                    ),
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
