import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_markdown/flutter_markdown.dart';

import '../../config/api_config.dart';
import '../../core/local_ml_engine.dart';
import '../../services/chat_service.dart';

class ChatScreenPage extends StatefulWidget {
  const ChatScreenPage({super.key});

  @override
  State<ChatScreenPage> createState() => _ChatScreenPageState();
}

class _ChatScreenPageState extends State<ChatScreenPage> with AutomaticKeepAliveClientMixin {
  @override
  bool get wantKeepAlive => true;

  final _inputController = TextEditingController();
  final _scrollController = ScrollController();
  final _chatService = ChatService();
  final _sessionId = 'mobile-${DateTime.now().millisecondsSinceEpoch}';

  String _selectedModel = 'Llama 3.2';
  bool _showReasoning = true;
  bool _serverOnline = false;
  String _serverStatusText = 'Checking server...';
  int? _serverLatencyMs;

  final _models = [
    'Llama 3.2',
    'NEXUS ML-Core',
    'Code Architect',
    'Reasoning Agent',
  ];

  final _starters = [
    'Compare He and She',
    'Write a Python function to reverse a linked list',
    'Explain how neural networks learn',
    'Design a REST API for a todo app',
  ];

  /* Persistent across tab switches, screen rebuilds and route transitions */
  static final List<_ChatMessage> _persistedMessages = [
    const _ChatMessage(
      '''## Welcome to NEXUS AI Mobile
I am **NEXUS**, your autonomous intelligence assistant.

- **Engine**: Llama 3.2 (3.2B parameters) & On-Device ML-Core
- **Privacy**: 100% Local • Zero External API Keys Required
- **Capabilities**: Full-stack code generation, linguistic comparisons, system design, and AI/ML explanations.
- **Mobility**: Works both connected to your PC server over Wi-Fi and 100% standalone offline!

Ask anything or tap a prompt suggestion below to begin!''',
      false,
      model: 'NEXUS Agent',
    ),
  ];

  List<_ChatMessage> get _messages => _persistedMessages;

  bool _isSending = false;
  List<String> _currentReasoningSteps = [];

  static const _blue = Color(0xff4f52ea);
  static const _darkBg = Color(0xff090d16);

  @override
  void initState() {
    super.initState();
    _checkServerStatus();
  }

  Future<void> _checkServerStatus() async {
    final res = await ApiConfig.testConnection();
    if (!mounted) return;
    setState(() {
      _serverOnline = res['success'] == true;
      _serverLatencyMs = res['latencyMs'] as int?;
      if (_serverOnline) {
        final model = res['model'] ?? 'Llama 3.2';
        _serverStatusText = 'Server Online (${_serverLatencyMs}ms • $model)';
      } else {
        _serverStatusText = 'On-Device ML (Offline Mode)';
      }
    });
  }

  @override
  void dispose() {
    _inputController.dispose();
    _scrollController.dispose();
    _chatService.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 250),
          curve: Curves.easeOut,
        );
      }
    });
  }

  void _send([String? customText]) {
    final text = customText ?? _inputController.text.trim();
    if (text.isEmpty || _isSending) return;

    final initialModelLabel = _serverOnline ? 'Llama 3.2 (Live)' : 'NEXUS ML-Core (On-Device)';
    final userMsg = _ChatMessage(text, true);
    final assistantMsg = _ChatMessage('', false, model: initialModelLabel);

    setState(() {
      _messages.add(userMsg);
      _messages.add(assistantMsg);
      _inputController.clear();
      _isSending = true;
      _currentReasoningSteps = [
        'Analyzing query: "$text"',
        'Extracting domain features & intent profile',
        'Synthesizing neural response...',
      ];
    });

    _scrollToBottom();

    final history = _messages
        .take(_messages.length - 2)
        .map((m) => {
              'role': m.fromUser ? 'user' : 'assistant',
              'content': m.text,
            })
        .toList();

    String resolvedModel = initialModelLabel;

    _chatService.sendMessage(
      message: text,
      sessionId: _sessionId,
      history: history,
      onSourceResolved: (source) {
        resolvedModel = source;
        if (mounted) {
          setState(() {
            final last = _messages.last;
            _messages[_messages.length - 1] = _ChatMessage(
              last.text,
              false,
              model: resolvedModel,
              reasoningSteps: List.from(_currentReasoningSteps),
            );
          });
        }
      },
      onThinking: (steps) {
        if (mounted) {
          setState(() {
            _currentReasoningSteps = steps;
          });
        }
      },
      onDelta: (delta) {
        if (mounted) {
          setState(() {
            final last = _messages.last;
            _messages[_messages.length - 1] = _ChatMessage(
              last.text + delta,
              false,
              model: resolvedModel,
              reasoningSteps: List.from(_currentReasoningSteps),
            );
          });
          _scrollToBottom();
        }
      },
    ).then((finalText) {
      if (mounted) {
        setState(() {
          final last = _messages.last;
          if (last.text.trim().isEmpty) {
            _messages[_messages.length - 1] = _ChatMessage(
              finalText,
              false,
              model: resolvedModel,
              reasoningSteps: List.from(_currentReasoningSteps),
            );
          }
          _isSending = false;
        });
        _scrollToBottom();
      }
    }).catchError((_) {
      // In the extremely rare event that an unhandled exception occurred, fallback to on-device engine
      final fallback = LocalMlEngine.infer(text);
      if (mounted) {
        setState(() {
          _messages[_messages.length - 1] = _ChatMessage(
            fallback.response,
            false,
            model: 'On-Device ML-Core',
            reasoningSteps: fallback.reasoningSteps,
          );
          _isSending = false;
        });
        _scrollToBottom();
      }
    });
  }

  void _clearChat() {
    setState(() {
      _messages.clear();
      _messages.add(const _ChatMessage(
        'Chat context cleared. Ready for a new topic.',
        false,
        model: 'NEXUS Agent',
      ));
      _currentReasoningSteps = [];
    });
  }

  void _openServerConfigDialog() {
    final hostController = TextEditingController(text: ApiConfig.currentHost);
    bool testing = false;
    String? testResult;
    bool? testSuccess;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) {
          final isDark = Theme.of(context).brightness == Brightness.dark;
          final sheetBg = isDark ? const Color(0xff0f172a) : Colors.white;
          final cardBorder = isDark ? const Color(0xff1e293b) : const Color(0xffe2e8f0);
          final textPrimary = isDark ? Colors.white : const Color(0xff0f172a);
          final textMuted = isDark ? const Color(0xff94a3b8) : const Color(0xff64748b);

          return Padding(
            padding: EdgeInsets.only(
              bottom: MediaQuery.of(context).viewInsets.bottom,
            ),
            child: Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: sheetBg,
                borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
                border: Border.all(color: cardBorder),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: _blue.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(Icons.settings_ethernet_rounded, color: _blue, size: 20),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Server Connection Settings',
                              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: textPrimary),
                            ),
                            Text(
                              'Connect to your PC or run on-device offline',
                              style: TextStyle(fontSize: 12, color: textMuted),
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close_rounded, size: 20),
                        onPressed: () => Navigator.pop(ctx),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  Text(
                    'Quick Presets:',
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: textMuted),
                  ),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      _presetChip(
                        label: 'Wi-Fi LAN (${ApiConfig.defaultLanIp})',
                        onTap: () {
                          setModalState(() {
                            hostController.text = ApiConfig.defaultLanIp;
                            testResult = null;
                          });
                        },
                        isSelected: hostController.text.trim() == ApiConfig.defaultLanIp,
                      ),
                      _presetChip(
                        label: 'USB Cable (localhost)',
                        onTap: () {
                          setModalState(() {
                            hostController.text = ApiConfig.defaultLocalhost;
                            testResult = null;
                          });
                        },
                        isSelected: hostController.text.trim() == ApiConfig.defaultLocalhost,
                      ),
                      _presetChip(
                        label: 'Emulator (10.0.2.2)',
                        onTap: () {
                          setModalState(() {
                            hostController.text = ApiConfig.defaultEmulatorIp;
                            testResult = null;
                          });
                        },
                        isSelected: hostController.text.trim() == ApiConfig.defaultEmulatorIp,
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  Text(
                    'Server Host IP or Domain:',
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: textMuted),
                  ),
                  const SizedBox(height: 6),
                  TextField(
                    controller: hostController,
                    style: TextStyle(color: textPrimary, fontSize: 14),
                    decoration: InputDecoration(
                      hintText: 'e.g. 172.168.68.146 or 192.168.1.X',
                      hintStyle: TextStyle(color: textMuted),
                      prefixIcon: const Icon(Icons.dns_rounded, size: 18, color: _blue),
                      filled: true,
                      fillColor: isDark ? const Color(0xff131c2e) : const Color(0xfff8fafc),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide(color: cardBorder)),
                      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide(color: cardBorder)),
                      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: _blue, width: 1.5)),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    ),
                  ),
                  const SizedBox(height: 12),

                  if (testResult != null)
                    Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: testSuccess == true ? const Color(0xff10b981).withValues(alpha: 0.15) : const Color(0xffef4444).withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: testSuccess == true ? const Color(0xff10b981) : const Color(0xffef4444),
                          width: 1,
                        ),
                      ),
                      child: Row(
                        children: [
                          Icon(
                            testSuccess == true ? Icons.check_circle_rounded : Icons.info_outline_rounded,
                            size: 18,
                            color: testSuccess == true ? const Color(0xff10b981) : const Color(0xffef4444),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              testResult!,
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: testSuccess == true ? const Color(0xff10b981) : const Color(0xffef4444),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),

                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton.icon(
                          icon: testing
                              ? const SizedBox(width: 14, height: 14, child: CircularProgressIndicator(strokeWidth: 2, color: _blue))
                              : const Icon(Icons.bolt_rounded, size: 16, color: _blue),
                          label: Text(testing ? 'Testing...' : 'Test Connection'),
                          style: OutlinedButton.styleFrom(
                            side: const BorderSide(color: _blue),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                            padding: const EdgeInsets.symmetric(vertical: 12),
                          ),
                          onPressed: testing
                              ? null
                              : () async {
                                  setModalState(() {
                                    testing = true;
                                    testResult = null;
                                  });
                                  final probe = await ApiConfig.testConnection(hostController.text);
                                  setModalState(() {
                                    testing = false;
                                    testSuccess = probe['success'] == true;
                                    testResult = probe['message'] as String?;
                                  });
                                },
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: ElevatedButton.icon(
                          icon: const Icon(Icons.save_rounded, size: 16, color: Colors.white),
                          label: const Text('Save & Apply', style: TextStyle(color: Colors.white)),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: _blue,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                            padding: const EdgeInsets.symmetric(vertical: 12),
                          ),
                          onPressed: () async {
                            final targetHost = hostController.text.trim();
                            await ApiConfig.setHost(targetHost);
                            Navigator.pop(ctx);
                            await _checkServerStatus();
                            if (mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text('Server host updated to: ${ApiConfig.currentHost}'),
                                  backgroundColor: _blue,
                                  duration: const Duration(seconds: 2),
                                ),
                              );
                            }
                          },
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    '💡 Tip: For USB debugging, run `adb reverse tcp:3000 tcp:3000` on your PC. For Wi-Fi, ensure your phone is connected to the same network.',
                    style: TextStyle(fontSize: 11, color: textMuted, height: 1.3),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _presetChip({required String label, required VoidCallback onTap, required bool isSelected}) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(10),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? _blue : _blue.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.bold,
            color: isSelected ? Colors.white : _blue,
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bg = isDark ? _darkBg : const Color(0xfff8fafc);
    final cardBg = isDark ? const Color(0xff0f172a) : Colors.white;
    final cardBorder = isDark ? const Color(0xff1e293b) : const Color(0xffe2e8f0);
    final textPrimary = isDark ? Colors.white : const Color(0xff0f172a);
    final textMuted = isDark ? const Color(0xff94a3b8) : const Color(0xff64748b);

    return Scaffold(
      backgroundColor: bg,
      appBar: AppBar(
        backgroundColor: cardBg,
        elevation: 0.5,
        title: InkWell(
          onTap: _openServerConfigDialog,
          borderRadius: BorderRadius.circular(12),
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 4, horizontal: 2),
            child: Row(
              children: [
                Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [_blue, Color(0xff818cf8)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(Icons.psychology_rounded, color: Colors.white, size: 20),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'NEXUS Mobile AI',
                        style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800),
                      ),
                      Row(
                        children: [
                          Container(
                            width: 7,
                            height: 7,
                            decoration: BoxDecoration(
                              color: _serverOnline ? const Color(0xff10b981) : const Color(0xffa855f7),
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(width: 5),
                          Flexible(
                            child: Text(
                              _serverStatusText,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                fontSize: 10.5,
                                color: _serverOnline ? const Color(0xff10b981) : textMuted,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
        actions: [
          IconButton(
            tooltip: 'Server Connection Settings',
            onPressed: _openServerConfigDialog,
            icon: Icon(
              Icons.settings_ethernet_rounded,
              size: 20,
              color: _serverOnline ? const Color(0xff10b981) : _blue,
            ),
          ),
          IconButton(
            tooltip: 'Clear conversation',
            onPressed: _isSending ? null : _clearChat,
            icon: const Icon(Icons.refresh_rounded, size: 20),
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // ── Top Model Selector Chips ──
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              color: cardBg.withValues(alpha: 0.8),
              child: SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: _models.map((m) {
                    final isSelected = m == _selectedModel;
                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: ChoiceChip(
                        label: Text(m),
                        selected: isSelected,
                        onSelected: (_) => setState(() => _selectedModel = m),
                        selectedColor: _blue,
                        labelStyle: TextStyle(
                          fontSize: 11.5,
                          fontWeight: FontWeight.bold,
                          color: isSelected ? Colors.white : textMuted,
                        ),
                        backgroundColor: cardBg,
                        side: BorderSide(
                          color: isSelected ? _blue : cardBorder,
                        ),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                    );
                  }).toList(),
                ),
              ),
            ),

            // ── Quick Starters Chips ──
            if (_messages.length <= 1)
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Suggested Prompts:',
                      style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: textMuted),
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: _starters.map((starter) {
                        return ActionChip(
                          avatar: const Icon(Icons.auto_awesome, size: 14, color: _blue),
                          label: Text(starter),
                          labelStyle: TextStyle(fontSize: 11.5, color: textPrimary),
                          backgroundColor: cardBg,
                          side: BorderSide(color: cardBorder),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          onPressed: () => _send(starter),
                        );
                      }).toList(),
                    ),
                  ],
                ),
              ),

            // ── Messages Feed ──
            Expanded(
              child: ListView.builder(
                controller: _scrollController,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                itemCount: _messages.length,
                itemBuilder: (context, index) {
                  final msg = _messages[index];
                  final isLast = index == _messages.length - 1;
                  return _messageItem(
                    msg,
                    isLast && _isSending,
                    isDark,
                    cardBg,
                    cardBorder,
                    textPrimary,
                    textMuted,
                  );
                },
              ),
            ),

            // ── Bottom Composer ──
            _composer(isDark, cardBg, cardBorder, textPrimary, textMuted),
          ],
        ),
      ),
    );
  }

  Widget _messageItem(
    _ChatMessage message,
    bool isGenerating,
    bool isDark,
    Color cardBg,
    Color cardBorder,
    Color textPrimary,
    Color textMuted,
  ) {
    if (message.fromUser) {
      return Align(
        alignment: Alignment.centerRight,
        child: Container(
          constraints: BoxConstraints(
            maxWidth: MediaQuery.of(context).size.width * 0.85,
          ),
          margin: const EdgeInsets.only(bottom: 16),
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [_blue, Color(0xff6366f1)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(20).copyWith(bottomRight: Radius.zero),
            boxShadow: [
              BoxShadow(
                color: _blue.withValues(alpha: 0.25),
                blurRadius: 8,
                offset: const Offset(0, 3),
              ),
            ],
          ),
          child: Text(
            message.text,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 14,
              height: 1.4,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
      );
    }

    // Assistant Message with Reasoning & Markdown Body
    return Align(
      alignment: Alignment.centerLeft,
      child: Container(
        constraints: BoxConstraints(
          maxWidth: MediaQuery.of(context).size.width > 768 ? 720 : double.infinity,
        ),
        margin: const EdgeInsets.only(bottom: 16),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: cardBg,
          borderRadius: BorderRadius.circular(20).copyWith(bottomLeft: Radius.zero),
          border: Border.all(color: cardBorder, width: 1.2),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: isDark ? 0.35 : 0.04),
              blurRadius: 10,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Model Header
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    color: _blue.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Icon(Icons.bolt_rounded, color: _blue, size: 14),
                ),
                const SizedBox(width: 8),
                Text(
                  message.model ?? 'NEXUS Agent',
                  style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: _blue),
                ),
                const Spacer(),
                IconButton(
                  icon: const Icon(Icons.copy_rounded, size: 14),
                  tooltip: 'Copy response',
                  padding: EdgeInsets.zero,
                  constraints: const BoxConstraints(),
                  onPressed: () {
                    Clipboard.setData(ClipboardData(text: message.text));
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Response copied to clipboard!'), duration: Duration(seconds: 1)),
                    );
                  },
                ),
              ],
            ),
            const SizedBox(height: 10),

            // Reasoning Accordion (if available)
            if (message.reasoningSteps.isNotEmpty || (_currentReasoningSteps.isNotEmpty && isGenerating))
              Container(
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xff091122) : const Color(0xfff1f5f9),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: _blue.withValues(alpha: 0.2)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    InkWell(
                      onTap: () => setState(() => _showReasoning = !_showReasoning),
                      child: Row(
                        children: [
                          const Icon(Icons.psychology_alt_rounded, color: _blue, size: 16),
                          const SizedBox(width: 6),
                          Text(
                            'Reasoning Steps (${(message.reasoningSteps.isNotEmpty ? message.reasoningSteps : _currentReasoningSteps).length})',
                            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: _blue),
                          ),
                          const Spacer(),
                          Icon(
                            _showReasoning ? Icons.expand_less_rounded : Icons.expand_more_rounded,
                            size: 16,
                            color: _blue,
                          ),
                        ],
                      ),
                    ),
                    if (_showReasoning) ...[
                      const Divider(height: 12),
                      ...(message.reasoningSteps.isNotEmpty ? message.reasoningSteps : _currentReasoningSteps)
                          .map((step) => Padding(
                                padding: const EdgeInsets.symmetric(vertical: 2),
                                child: Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Text('• ', style: TextStyle(color: _blue, fontWeight: FontWeight.bold)),
                                    Expanded(
                                      child: Text(
                                        step,
                                        style: TextStyle(fontSize: 11, color: textMuted, height: 1.3),
                                      ),
                                    ),
                                  ],
                                ),
                              )),
                    ],
                  ],
                ),
              ),

            // Generating indicator
            if (message.text.isEmpty && isGenerating)
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 8),
                child: Row(
                  children: [
                    const SizedBox(
                      width: 16,
                      height: 16,
                      child: CircularProgressIndicator(strokeWidth: 2, color: _blue),
                    ),
                    const SizedBox(width: 10),
                    Text(
                      'Synthesizing response...',
                      style: TextStyle(fontSize: 12, color: textMuted),
                    ),
                  ],
                ),
              )
            else
              // Full Markdown Rendered Body
              MarkdownBody(
                data: message.text,
                selectable: true,
                styleSheet: MarkdownStyleSheet(
                  p: TextStyle(color: textPrimary, fontSize: 13.5, height: 1.45),
                  h1: TextStyle(color: textPrimary, fontSize: 18, fontWeight: FontWeight.w800, height: 1.3),
                  h2: TextStyle(color: textPrimary, fontSize: 16, fontWeight: FontWeight.w700, height: 1.3),
                  h3: TextStyle(color: textPrimary, fontSize: 14, fontWeight: FontWeight.w600, height: 1.3),
                  strong: TextStyle(color: textPrimary, fontWeight: FontWeight.bold),
                  code: TextStyle(
                    fontFamily: 'monospace',
                    fontSize: 12,
                    backgroundColor: isDark ? const Color(0xff1e293b) : const Color(0xffe2e8f0),
                    color: _blue,
                  ),
                  codeblockDecoration: BoxDecoration(
                    color: isDark ? const Color(0xff0b0f19) : const Color(0xfff1f5f9),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: cardBorder),
                  ),
                  tableBorder: TableBorder.all(color: cardBorder, width: 1),
                  tableHead: TextStyle(color: textPrimary, fontWeight: FontWeight.bold, fontSize: 12),
                  tableBody: TextStyle(color: textPrimary, fontSize: 12),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _composer(bool isDark, Color cardBg, Color cardBorder, Color textPrimary, Color textMuted) {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 12),
      decoration: BoxDecoration(
        color: cardBg,
        border: Border(top: BorderSide(color: cardBorder, width: 1)),
      ),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: _inputController,
              enabled: !_isSending,
              style: TextStyle(color: textPrimary, fontSize: 13.5),
              textInputAction: TextInputAction.send,
              onSubmitted: (_) => _send(),
              decoration: InputDecoration(
                hintText: _serverOnline
                    ? 'Ask NEXUS (Streaming Llama 3.2)...'
                    : 'Ask NEXUS (100% Offline ML Mode)...',
                hintStyle: TextStyle(fontSize: 13, color: textMuted),
                filled: true,
                fillColor: isDark ? const Color(0xff131c2e) : const Color(0xfff8fafc),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(22),
                  borderSide: BorderSide(color: cardBorder),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(22),
                  borderSide: BorderSide(color: cardBorder),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(22),
                  borderSide: const BorderSide(color: _blue, width: 1.5),
                ),
                contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              ),
            ),
          ),
          const SizedBox(width: 8),
          IconButton.filled(
            tooltip: 'Send prompt',
            onPressed: _isSending ? null : () => _send(),
            style: IconButton.styleFrom(
              backgroundColor: _blue,
              padding: const EdgeInsets.all(12),
            ),
            icon: const Icon(Icons.send_rounded, color: Colors.white, size: 18),
          ),
        ],
      ),
    );
  }
}

class _ChatMessage {
  final String text;
  final bool fromUser;
  final String? model;
  final List<String> reasoningSteps;

  const _ChatMessage(
    this.text,
    this.fromUser, {
    this.model,
    this.reasoningSteps = const [],
  });
}
