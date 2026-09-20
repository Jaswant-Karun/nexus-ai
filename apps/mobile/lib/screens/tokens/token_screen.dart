import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../services/token_service.dart';

class TokenScreen extends StatefulWidget {
  const TokenScreen({super.key});

  @override
  State<TokenScreen> createState() => _TokenScreenState();
}

class _TokenScreenState extends State<TokenScreen> {
  final _tokenService = TokenService.instance;
  List<ApiToken> _tokens = [];
  bool _isLoading = true;
  String? _newlyCreatedSecret;
  String? _copiedId;

  static const _blue = Color(0xff4f52ea);

  @override
  void initState() {
    super.initState();
    _loadTokens();
  }

  Future<void> _loadTokens() async {
    setState(() => _isLoading = true);
    final tokens = await _tokenService.getTokens();
    if (mounted) {
      setState(() {
        _tokens = tokens;
        _isLoading = false;
      });
    }
  }

  void _showGenerateDialog() {
    final nameController = TextEditingController(text: 'Mobile Device Access Key');
    String selectedScope = 'Full Access (Read/Write)';

    showDialog(
      context: context,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            return AlertDialog(
              title: const Row(
                children: [
                  Icon(Icons.vpn_key_rounded, color: _blue, size: 22),
                  SizedBox(width: 10),
                  Text('Generate API Token', style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold)),
                ],
              ),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Issue a secure cryptographic Bearer token for authenticating automated mobile pipelines and external SDK calls.',
                      style: TextStyle(fontSize: 12, color: Color(0xff64748b)),
                    ),
                    const SizedBox(height: 16),
                    TextField(
                      controller: nameController,
                      decoration: const InputDecoration(
                        labelText: 'Token Label',
                        hintText: 'e.g. iOS Client, Automation Worker',
                      ),
                    ),
                    const SizedBox(height: 14),
                    DropdownButtonFormField<String>(
                      initialValue: selectedScope,
                      decoration: const InputDecoration(
                        labelText: 'Permission Scope',
                      ),
                      items: const [
                        DropdownMenuItem(value: 'Full Access (Read/Write)', child: Text('Full Access (Read/Write)')),
                        DropdownMenuItem(value: 'Agent Dispatch Only', child: Text('Agent Dispatch Only')),
                        DropdownMenuItem(value: 'Read-Only Telemetry', child: Text('Read-Only Telemetry')),
                        DropdownMenuItem(value: 'Mobile & Workflows', child: Text('Mobile & Workflows')),
                      ],
                      onChanged: (v) {
                        if (v != null) setDialogState(() => selectedScope = v);
                      },
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.of(ctx).pop(),
                  child: const Text('Cancel'),
                ),
                FilledButton(
                  style: FilledButton.styleFrom(backgroundColor: _blue),
                  onPressed: () async {
                    final name = nameController.text.trim();
                    if (name.isEmpty) return;
                    Navigator.of(ctx).pop();

                    final token = await _tokenService.generateToken(
                      name: name,
                      scope: selectedScope,
                    );

                    if (mounted) {
                      setState(() {
                        _tokens.insert(0, token);
                        _newlyCreatedSecret = token.secret;
                      });

                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('API Token generated successfully!'),
                          backgroundColor: Color(0xff10b981),
                        ),
                      );
                    }
                  },
                  child: const Text('Generate Token'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  void _copyToClipboard(String text, String id) {
    Clipboard.setData(ClipboardData(text: text));
    setState(() => _copiedId = id);
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Token copied to clipboard!'),
        duration: Duration(seconds: 2),
      ),
    );
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) setState(() => _copiedId = null);
    });
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBg = isDark ? const Color(0xff111827) : Colors.white;
    final borderColor = isDark ? const Color(0xff1f293d) : const Color(0xffe2e8f0);

    return Scaffold(
      appBar: AppBar(
        title: const Text('API Tokens & Key Vault'),
        actions: [
          IconButton(
            tooltip: 'Refresh Tokens',
            icon: const Icon(Icons.refresh_rounded),
            onPressed: _loadTokens,
          ),
        ],
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 600),
          child: ListView(
            padding: const EdgeInsets.fromLTRB(20, 16, 20, 32),
            children: [
              // ── Header Card ──
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xff4341cf), Color(0xff6366f1)],
                  ),
                  borderRadius: BorderRadius.circular(22),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xff4341cf).withValues(alpha: 0.3),
                      blurRadius: 16,
                      offset: const Offset(0, 6),
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
                            color: Colors.white.withValues(alpha: 0.2),
                            borderRadius: BorderRadius.circular(14),
                          ),
                          child: const Icon(Icons.vpn_key_rounded, color: Colors.white, size: 24),
                        ),
                        const SizedBox(width: 12),
                        const Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Cryptographic Token Vault',
                                  style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w800)),
                              SizedBox(height: 2),
                              Text('Authorized credentials for mobile & API calls',
                                  style: TextStyle(color: Color(0xffe0e7ff), fontSize: 12)),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 18),
                    SizedBox(
                      width: double.infinity,
                      child: FilledButton.icon(
                        style: FilledButton.styleFrom(
                          backgroundColor: Colors.white,
                          foregroundColor: _blue,
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                        onPressed: _showGenerateDialog,
                        icon: const Icon(Icons.add_rounded, size: 20),
                        label: const Text('Generate New API Token', style: TextStyle(fontWeight: FontWeight.bold)),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // ── Newly Generated Token Highlight Banner ──
              if (_newlyCreatedSecret != null) ...[
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xff10b981).withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: const Color(0xff10b981), width: 1.5),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.check_circle_rounded, color: Color(0xff10b981), size: 18),
                          const SizedBox(width: 8),
                          const Text('NEW TOKEN ISSUED',
                              style: TextStyle(color: Color(0xff10b981), fontSize: 11, fontWeight: FontWeight.w800)),
                          const Spacer(),
                          IconButton(
                            icon: const Icon(Icons.close_rounded, size: 16),
                            onPressed: () => setState(() => _newlyCreatedSecret = null),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Copy this key now. For your protection, it will not be displayed in full again.',
                        style: TextStyle(fontSize: 12),
                      ),
                      const SizedBox(height: 10),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                        decoration: BoxDecoration(
                          color: isDark ? const Color(0xff090d16) : Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: const Color(0xff10b981).withValues(alpha: 0.4)),
                        ),
                        child: Row(
                          children: [
                            Expanded(
                              child: Text(
                                _newlyCreatedSecret!,
                                style: const TextStyle(fontFamily: 'monospace', fontSize: 12, fontWeight: FontWeight.bold),
                              ),
                            ),
                            const SizedBox(width: 8),
                            FilledButton.icon(
                              style: FilledButton.styleFrom(
                                backgroundColor: const Color(0xff10b981),
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                              ),
                              onPressed: () => _copyToClipboard(_newlyCreatedSecret!, 'newly_created'),
                              icon: Icon(
                                _copiedId == 'newly_created' ? Icons.check : Icons.copy_rounded,
                                size: 14,
                              ),
                              label: Text(_copiedId == 'newly_created' ? 'Copied' : 'Copy', style: const TextStyle(fontSize: 12)),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
              ],

              // ── Active Tokens List ──
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Active Access Tokens',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800)),
                  Text('${_tokens.length} issued',
                      style: TextStyle(fontSize: 12, color: Theme.of(context).colorScheme.outline)),
                ],
              ),
              const SizedBox(height: 12),

              if (_isLoading)
                const Center(child: Padding(padding: EdgeInsets.all(40), child: CircularProgressIndicator()))
              else if (_tokens.isEmpty)
                Container(
                  padding: const EdgeInsets.all(28),
                  decoration: BoxDecoration(
                    color: cardBg,
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: borderColor),
                  ),
                  child: const Center(
                    child: Text('No active tokens yet. Generate one above.',
                        style: TextStyle(fontSize: 13, color: Color(0xff64748b))),
                  ),
                )
              else
                ..._tokens.map((token) {
                  return Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: cardBg,
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(color: borderColor),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: _blue.withValues(alpha: 0.1),
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: const Icon(Icons.key_rounded, color: _blue, size: 18),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(token.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                                  const SizedBox(height: 3),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                    decoration: BoxDecoration(
                                      color: isDark ? const Color(0xff1f293d) : const Color(0xffeef2ff),
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: Text(
                                      token.scope,
                                      style: TextStyle(
                                        fontSize: 10,
                                        fontWeight: FontWeight.w600,
                                        color: isDark ? const Color(0xff93c5fd) : const Color(0xff4341cf),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            IconButton(
                              tooltip: 'Revoke Key',
                              icon: const Icon(Icons.delete_outline_rounded, size: 19, color: Color(0xffef4444)),
                              onPressed: () async {
                                final confirm = await showDialog<bool>(
                                  context: context,
                                  builder: (ctx) => AlertDialog(
                                    title: const Text('Revoke Token?'),
                                    content: Text('Are you sure you want to revoke "${token.name}"? Any agent using this token will lose access.'),
                                    actions: [
                                      TextButton(onPressed: () => Navigator.of(ctx).pop(false), child: const Text('Cancel')),
                                      FilledButton(
                                        style: FilledButton.styleFrom(backgroundColor: const Color(0xffef4444)),
                                        onPressed: () => Navigator.of(ctx).pop(true),
                                        child: const Text('Revoke'),
                                      ),
                                    ],
                                  ),
                                );
                                if (confirm == true) {
                                  await _tokenService.revokeToken(token.id);
                                  setState(() => _tokens.removeWhere((t) => t.id == token.id));
                                  if (mounted) {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(content: Text('Token revoked.')),
                                    );
                                  }
                                }
                              },
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                          decoration: BoxDecoration(
                            color: isDark ? const Color(0xff090d16) : const Color(0xfff8fafc),
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(color: borderColor),
                          ),
                          child: Row(
                            children: [
                              Expanded(
                                child: Text(
                                  token.prefix,
                                  style: const TextStyle(fontFamily: 'monospace', fontSize: 11, color: Color(0xff64748b)),
                                ),
                              ),
                              if (token.secret != null)
                                InkWell(
                                  onTap: () => _copyToClipboard(token.secret!, token.id),
                                  child: Row(
                                    children: [
                                      Icon(_copiedId == token.id ? Icons.check : Icons.copy_rounded, size: 14, color: _blue),
                                      const SizedBox(width: 4),
                                      Text(_copiedId == token.id ? 'Copied' : 'Copy',
                                          style: const TextStyle(fontSize: 11, color: _blue, fontWeight: FontWeight.bold)),
                                    ],
                                  ),
                                ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 8),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text('Created: ${token.created}',
                                style: const TextStyle(fontSize: 11, color: Color(0xff64748b))),
                            Text('Last used: ${token.lastUsed}',
                                style: const TextStyle(fontSize: 11, color: Color(0xff64748b))),
                          ],
                        ),
                      ],
                    ),
                  );
                }),
            ],
          ),
        ),
      ),
    );
  }
}
