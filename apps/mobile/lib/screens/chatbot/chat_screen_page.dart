import 'package:flutter/material.dart';

import '../../services/chat_service.dart';

class ChatScreenPage extends StatefulWidget {
  const ChatScreenPage({super.key});

  @override
  State<ChatScreenPage> createState() => _ChatScreenPageState();
}

class _ChatScreenPageState extends State<ChatScreenPage> {
  final _inputController = TextEditingController();
  final _chatService = ChatService();
  final _sessionId = 'mobile-${DateTime.now().millisecondsSinceEpoch}';

  String _selectedModel = 'GPT-4o';
  bool _webSearchEnabled = true;
  bool _codeSandboxEnabled = true;
  bool _memoryEnabled = true;

  final _models = ['GPT-4o', 'Claude 3.5', 'Gemini 1.5 Pro', 'LLaMA 3.1'];

  final _starters = [
    'Analyze our Q3 enterprise revenue projections',
    'Write a Python script for semantic vector search',
    'Summarize our security & compliance handbook',
  ];

  final _messages = <_ChatMessage>[
    const _ChatMessage(
      'Hi Jaswant! I am Nexus AI Agent. I have full access to your vector knowledge base, tool execution sandbox, and active workflow pipelines. What shall we achieve today?',
      false,
      model: 'GPT-4o',
    ),
  ];
  bool _isSending = false;
  List<String> _reasoningSteps = [];

  static const _blue = Color(0xff4f52ea);

  @override
  void dispose() {
    _inputController.dispose();
    _chatService.dispose();
    super.dispose();
  }

  void _send([String? customText]) {
    final text = customText ?? _inputController.text.trim();
    if (text.isEmpty || _isSending) return;

    setState(() {
      _messages.add(_ChatMessage(text, true));
      _inputController.clear();
      _isSending = true;
      _reasoningSteps = ['Synthesizing intent using $_selectedModel...'];
    });

    _chatService.sendMessage(
      text,
      _sessionId,
      (partial) {
        if (mounted) {
          setState(() {
            _reasoningSteps = [partial];
          });
        }
      },
    ).then((reply) {
      if (mounted) {
        setState(() {
          _messages.add(_ChatMessage(reply, false, model: _selectedModel));
          _isSending = false;
          _reasoningSteps = [];
        });
      }
    }).catchError((err) {
      if (mounted) {
        setState(() {
          _messages.add(_ChatMessage('Error processing request: $err', false, isError: true, model: _selectedModel));
          _isSending = false;
          _reasoningSteps = [];
        });
      }
    });
  }

  void _clearChat() {
    setState(() {
      _messages.clear();
      _messages.add(const _ChatMessage('Chat context cleared. Ready for a new topic.', false, model: 'Nexus Agent'));
    });
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              width: 34,
              height: 34,
              decoration: BoxDecoration(
                color: _blue.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.auto_awesome, color: _blue, size: 18),
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Nexus AI Chat', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800)),
                Text('Active: $_selectedModel', style: const TextStyle(fontSize: 10, color: Color(0xff6c7890))),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            tooltip: 'Clear chat',
            onPressed: _isSending ? null : _clearChat,
            icon: const Icon(Icons.delete_outline_rounded),
          ),
        ],
      ),
      body: Column(
        children: [
          // ── Model Selector & Tools Bar ──
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xff0f172a) : const Color(0xfff1f5f9),
              border: Border(bottom: BorderSide(color: isDark ? const Color(0xff1e293b) : const Color(0xffe2e8f0))),
            ),
            child: Column(
              children: [
                // Models row
                SizedBox(
                  height: 32,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    itemCount: _models.length,
                    separatorBuilder: (_, __) => const SizedBox(width: 6),
                    itemBuilder: (context, i) {
                      final m = _models[i];
                      final isSelected = _selectedModel == m;
                      return ChoiceChip(
                        label: Text(m),
                        selected: isSelected,
                        selectedColor: _blue,
                        labelStyle: TextStyle(
                          color: isSelected ? Colors.white : null,
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                        ),
                        visualDensity: VisualDensity.compact,
                        padding: const EdgeInsets.symmetric(horizontal: 4),
                        onSelected: (_) => setState(() => _selectedModel = m),
                      );
                    },
                  ),
                ),
                const SizedBox(height: 6),
                // Tool Toggles
                Row(
                  children: [
                    _toolToggle('🌐 Web', _webSearchEnabled, () => setState(() => _webSearchEnabled = !_webSearchEnabled)),
                    const SizedBox(width: 6),
                    _toolToggle('💻 Code', _codeSandboxEnabled, () => setState(() => _codeSandboxEnabled = !_codeSandboxEnabled)),
                    const SizedBox(width: 6),
                    _toolToggle('🧠 Memory', _memoryEnabled, () => setState(() => _memoryEnabled = !_memoryEnabled)),
                  ],
                ),
              ],
            ),
          ),

          // ── Message Stream ──
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 16),
              itemCount: _messages.length + (_isSending ? 1 : 0),
              itemBuilder: (context, index) {
                if (index == _messages.length) return _thinkingBubble();
                return _bubble(_messages[index]);
              },
            ),
          ),

          // Starter Suggestions if chat is fresh
          if (_messages.length <= 1)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              child: SizedBox(
                height: 32,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  itemCount: _starters.length,
                  separatorBuilder: (_, __) => const SizedBox(width: 8),
                  itemBuilder: (context, i) => ActionChip(
                    label: Text(_starters[i]),
                    labelStyle: const TextStyle(fontSize: 11),
                    padding: const EdgeInsets.symmetric(horizontal: 6),
                    onPressed: () => _send(_starters[i]),
                  ),
                ),
              ),
            ),

          // ── Composer ──
          _composer(),
        ],
      ),
    );
  }

  Widget _toolToggle(String label, bool active, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
        decoration: BoxDecoration(
          color: active ? _blue.withValues(alpha: 0.15) : Colors.transparent,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: active ? _blue : const Color(0xff64748b).withValues(alpha: 0.3)),
        ),
        child: Text(
          label,
          style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: active ? _blue : const Color(0xff64748b)),
        ),
      ),
    );
  }

  Widget _bubble(_ChatMessage message) {
    return Align(
      alignment: message.fromUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        constraints: const BoxConstraints(maxWidth: 320),
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: message.isError
              ? const Color(0xffffe8e8)
              : message.fromUser
                  ? _blue
                  : Theme.of(context).cardColor,
          borderRadius: BorderRadius.circular(18).copyWith(
            bottomRight: message.fromUser ? Radius.zero : null,
            bottomLeft: message.fromUser ? null : Radius.zero,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 4,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (!message.fromUser && message.model != null)
              Padding(
                padding: const EdgeInsets.only(bottom: 4),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.auto_awesome, color: _blue, size: 12),
                    const SizedBox(width: 4),
                    Text(
                      message.model!,
                      style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: _blue),
                    ),
                  ],
                ),
              ),
            Text(
              message.text,
              style: TextStyle(
                color: message.isError
                    ? const Color(0xffa52222)
                    : message.fromUser
                        ? Colors.white
                        : null,
                height: 1.4,
                fontSize: 13.5,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _thinkingBubble() {
    return Align(
      alignment: Alignment.centerLeft,
      child: Container(
        constraints: const BoxConstraints(maxWidth: 320),
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: Theme.of(context).cardColor,
          borderRadius: BorderRadius.circular(18).copyWith(bottomLeft: Radius.zero),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(
              width: 14,
              height: 14,
              child: CircularProgressIndicator(strokeWidth: 2, color: _blue),
            ),
            const SizedBox(width: 10),
            Flexible(
              child: Text(
                _reasoningSteps.isEmpty ? 'Nexus is reasoning with $_selectedModel...' : _reasoningSteps.last,
                style: const TextStyle(color: Color(0xff6c7890), fontSize: 12),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _composer() {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 6, 16, 12),
        child: Row(
          children: [
            Expanded(
              child: TextField(
                controller: _inputController,
                enabled: !_isSending,
                textInputAction: TextInputAction.send,
                onSubmitted: (_) => _send(),
                decoration: InputDecoration(
                  hintText: 'Ask Nexus ($_selectedModel)...',
                  hintStyle: const TextStyle(fontSize: 13),
                  filled: true,
                  fillColor: Theme.of(context).cardColor,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(20),
                    borderSide: BorderSide.none,
                  ),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
                ),
              ),
            ),
            const SizedBox(width: 8),
            IconButton.filled(
              tooltip: 'Send message',
              onPressed: _isSending ? null : () => _send(),
              style: IconButton.styleFrom(backgroundColor: _blue),
              icon: const Icon(Icons.send_rounded, color: Colors.white, size: 18),
            ),
          ],
        ),
      ),
    );
  }
}

class _ChatMessage {
  final String text;
  final bool fromUser;
  final bool isError;
  final String? model;

  const _ChatMessage(this.text, this.fromUser, {this.isError = false, this.model});
}
