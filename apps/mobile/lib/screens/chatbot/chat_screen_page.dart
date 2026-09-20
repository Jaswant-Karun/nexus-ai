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
  final _messages = <_ChatMessage>[
    const _ChatMessage('Hi Alex. What are we working on today?', false),
  ];
  bool _isSending = false;
  List<String> _reasoningSteps = [];

  @override
  void dispose() {
    _inputController.dispose();
    _chatService.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Row(children: [
          CircleAvatar(
              radius: 17,
              backgroundColor: Color(0xffe9f0ff),
              child:
                  Icon(Icons.auto_awesome, color: Color(0xff2d6cdf), size: 18)),
          SizedBox(width: 10),
          Text('Ask Nexus'),
        ]),
        actions: [
          IconButton(
            tooltip: 'Clear chat',
            onPressed: _isSending ? null : _clearChat,
            icon: const Icon(Icons.delete_outline),
          ),
        ],
      ),
      body: Column(children: [
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.fromLTRB(20, 24, 20, 20),
            itemCount: _messages.length + (_isSending ? 1 : 0),
            itemBuilder: (context, index) {
              if (index == _messages.length) return _thinkingBubble();
              return _bubble(_messages[index]);
            },
          ),
        ),
        _composer(),
      ]),
    );
  }

  Widget _bubble(_ChatMessage message) {
    return Align(
      alignment:
          message.fromUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        constraints: const BoxConstraints(maxWidth: 310),
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: message.isError
              ? const Color(0xffffe8e8)
              : message.fromUser
                  ? const Color(0xff2d6cdf)
                  : Theme.of(context).cardColor,
          borderRadius: BorderRadius.circular(18).copyWith(
              bottomRight: message.fromUser ? Radius.zero : null,
              bottomLeft: message.fromUser ? null : Radius.zero),
        ),
        child: Text(
          message.text,
          style: TextStyle(
            color: message.isError
                ? const Color(0xffa52222)
                : message.fromUser
                    ? Colors.white
                    : null,
            height: 1.35,
          ),
        ),
      ),
    );
  }

  Widget _thinkingBubble() {
    return Align(
      alignment: Alignment.centerLeft,
      child: Container(
        constraints: const BoxConstraints(maxWidth: 310),
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: Theme.of(context).cardColor,
          borderRadius:
              BorderRadius.circular(18).copyWith(bottomLeft: Radius.zero),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(
              width: 16,
              height: 16,
              child: CircularProgressIndicator(strokeWidth: 2),
            ),
            const SizedBox(width: 10),
            Flexible(
              child: Text(
                _reasoningSteps.isEmpty
                    ? 'Nexus is thinking...'
                    : _reasoningSteps.last,
                style: const TextStyle(color: Color(0xff6c7890)),
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
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 12),
        child: Row(children: [
          Expanded(
            child: TextField(
              controller: _inputController,
              enabled: !_isSending,
              textInputAction: TextInputAction.send,
              onSubmitted: (_) => _send(),
              decoration: InputDecoration(
                hintText: 'Ask Nexus anything...',
                filled: true,
                fillColor: Theme.of(context).cardColor,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(18),
                  borderSide: BorderSide.none,
                ),
                contentPadding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 13),
              ),
            ),
          ),
          const SizedBox(width: 8),
          IconButton.filled(
            tooltip: 'Send message',
            onPressed: _isSending ? null : _send,
            icon: _isSending
                ? const SizedBox(
                    width: 18,
                    height: 18,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : const Icon(Icons.arrow_upward_rounded),
          ),
        ]),
      ),
    );
  }

  Future<void> _send() async {
    final text = _inputController.text.trim();
    if (text.isEmpty || _isSending) return;
    final history = _messages
        .where((message) => !message.isError)
        .map((message) => {
              'role': message.fromUser ? 'user' : 'assistant',
              'content': message.text,
            })
        .toList();
    final responseIndex = _messages.length;
    setState(() {
      _messages.add(_ChatMessage(text, true));
      _messages.add(const _ChatMessage('', false));
      _isSending = true;
      _reasoningSteps = [];
      _inputController.clear();
    });

    try {
      await _chatService.streamNexusMessage(
        message: text,
        sessionId: _sessionId,
        history: history,
        onEvent: _handleAgentEvent,
      );
    } catch (error) {
      if (!mounted) return;
      setState(() {
        _messages[responseIndex + 1] = _ChatMessage(
          'Unable to reach Nexus Agent. Start the AI service at http://localhost:8001 and try again.\n\n$error',
          false,
          isError: true,
        );
      });
    } finally {
      if (mounted) setState(() => _isSending = false);
    }
  }

  void _handleAgentEvent(Map<String, dynamic> event) {
    if (!mounted) return;
    final type = event['type'];
    if (type == 'thinking') {
      setState(() {
        _reasoningSteps = (event['steps'] as List<dynamic>? ?? [])
            .map((step) => step.toString())
            .toList();
      });
    } else if (type == 'delta') {
      final content = event['content']?.toString() ?? '';
      if (content.isEmpty) return;
      setState(() {
        final last = _messages.last;
        _messages[_messages.length - 1] = _ChatMessage(
          '${last.text}$content',
          false,
          isError: false,
        );
      });
    } else if (type == 'error') {
      setState(() {
        _messages[_messages.length - 1] = _ChatMessage(
          event['error']?.toString() ?? 'The Nexus Agent returned an error.',
          false,
          isError: true,
        );
      });
    }
  }

  void _clearChat() {
    setState(() {
      _messages
        ..clear()
        ..add(const _ChatMessage(
            'Hi Alex. What are we working on today?', false));
      _reasoningSteps = [];
    });
  }
}

class _ChatMessage {
  const _ChatMessage(this.text, this.fromUser, {this.isError = false});

  final String text;
  final bool fromUser;
  final bool isError;
}
