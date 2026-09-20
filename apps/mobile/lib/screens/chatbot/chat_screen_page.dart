import 'package:flutter/material.dart';

class ChatScreenPage extends StatefulWidget {
  const ChatScreenPage({super.key});

  @override
  State<ChatScreenPage> createState() => _ChatScreenPageState();
}

class _ChatScreenPageState extends State<ChatScreenPage> {
  final _inputController = TextEditingController();
  final _messages = <_ChatMessage>[
    const _ChatMessage('Hi Alex. What are we working on today?', false),
  ];

  @override
  void dispose() {
    _inputController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Row(children: [
          CircleAvatar(radius: 17, backgroundColor: Color(0xffe9f0ff), child: Icon(Icons.auto_awesome, color: Color(0xff2d6cdf), size: 18)),
          SizedBox(width: 10),
          Text('Ask Nexus'),
        ]),
        actions: [IconButton(tooltip: 'Clear chat', onPressed: _clearChat, icon: const Icon(Icons.delete_outline))],
      ),
      body: Column(children: [
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.fromLTRB(20, 24, 20, 20),
            itemCount: _messages.length,
            itemBuilder: (context, index) => _bubble(_messages[index]),
          ),
        ),
        _composer(),
      ]),
    );
  }

  Widget _bubble(_ChatMessage message) {
    return Align(
      alignment: message.fromUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        constraints: const BoxConstraints(maxWidth: 310),
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: message.fromUser ? const Color(0xff2d6cdf) : Theme.of(context).cardColor,
          borderRadius: BorderRadius.circular(18).copyWith(bottomRight: message.fromUser ? Radius.zero : null, bottomLeft: message.fromUser ? null : Radius.zero),
        ),
        child: Text(message.text, style: TextStyle(color: message.fromUser ? Colors.white : null, height: 1.35)),
      ),
    );
  }

  Widget _composer() {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 12),
        child: Row(children: [
          Expanded(child: TextField(controller: _inputController, textInputAction: TextInputAction.send, onSubmitted: (_) => _send(), decoration: InputDecoration(hintText: 'Ask Nexus anything...', filled: true, fillColor: Theme.of(context).cardColor, border: OutlineInputBorder(borderRadius: BorderRadius.circular(18), borderSide: BorderSide.none), contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 13)))),
          const SizedBox(width: 8),
          IconButton.filled(tooltip: 'Send message', onPressed: _send, icon: const Icon(Icons.arrow_upward_rounded)),
        ]),
      ),
    );
  }

  void _send() {
    final text = _inputController.text.trim();
    if (text.isEmpty) return;
    setState(() {
      _messages.add(_ChatMessage(text, true));
      _messages.add(const _ChatMessage('I am on it. I will help you turn that into a clear next step.', false));
      _inputController.clear();
    });
  }

  void _clearChat() {
    setState(() {
      _messages
        ..clear()
        ..add(const _ChatMessage('Hi Alex. What are we working on today?', false));
    });
  }
}

class _ChatMessage {
  const _ChatMessage(this.text, this.fromUser);

  final String text;
  final bool fromUser;
}
