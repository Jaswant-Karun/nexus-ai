import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_markdown/flutter_markdown.dart';

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

  String _selectedModel = 'Llama 3.2 (Offline)';
  bool _showReasoning = true;

  final _models = [
    'Llama 3.2 (Offline)',
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
I am **NEXUS**, your offline autonomous intelligence assistant.

- **Engine**: Llama 3.2 (3.2B parameters) & Local ML-Core
- **Privacy**: 100% Offline • Zero API Keys Required
- **Capabilities**: Full-stack code generation, linguistic comparisons, system design, and AI/ML explanations.

Ask anything or tap a prompt suggestion below to begin!''',
      false,
      model: 'Llama 3.2 (Offline)',
    ),
  ];

  List<_ChatMessage> get _messages => _persistedMessages;

  bool _isSending = false;
  List<String> _currentReasoningSteps = [];

  static const _blue = Color(0xff4f52ea);
  static const _darkBg = Color(0xff090d16);

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

    final userMsg = _ChatMessage(text, true);
    final assistantMsg = _ChatMessage('', false, model: _selectedModel);

    setState(() {
      _messages.add(userMsg);
      _messages.add(assistantMsg);
      _inputController.clear();
      _isSending = true;
      _currentReasoningSteps = [
        'Analyzing query: "$text"',
        'Extracting domain features & intent profile',
        'Synthesizing offline neural response...',
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

    _chatService.sendMessage(
      message: text,
      sessionId: _sessionId,
      history: history,
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
              model: _selectedModel,
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
              model: _selectedModel,
              reasoningSteps: List.from(_currentReasoningSteps),
            );
          }
          _isSending = false;
        });
        _scrollToBottom();
      }
    }).catchError((err) {
      if (mounted) {
        setState(() {
          _messages[_messages.length - 1] = _ChatMessage(
            '⚠️ Failed to generate response: $err\n\nPlease ensure your local server or Ollama is running.',
            false,
            isError: true,
            model: _selectedModel,
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
        model: 'Llama 3.2 (Offline)',
      ));
      _currentReasoningSteps = [];
    });
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
        title: Row(
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
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800),
                  ),
                  Row(
                    children: [
                      Container(
                        width: 6,
                        height: 6,
                        decoration: const BoxDecoration(
                          color: Color(0xff10b981),
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 5),
                      Text(
                        '100% Offline • Zero API Keys',
                        style: TextStyle(fontSize: 10, color: textMuted, fontWeight: FontWeight.w600),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
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
                      'Streaming response from local neural network...',
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
                hintText: 'Ask NEXUS anything (100% Offline)...',
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
  final bool isError;
  final String? model;
  final List<String> reasoningSteps;

  const _ChatMessage(
    this.text,
    this.fromUser, {
    this.isError = false,
    this.model,
    this.reasoningSteps = const [],
  });
}
