import 'package:flutter/material.dart';
import '../../config/routes.dart';
import '../../services/auth_service.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  // Sign In controllers
  final _loginEmailController = TextEditingController(text: 'jaswant@nexus.ai');
  final _loginPasswordController = TextEditingController(text: 'password123');
  bool _loginObscure = true;
  bool _isLoggingIn = false;

  // Sign Up controllers
  final _signupNameController = TextEditingController();
  final _signupEmailController = TextEditingController();
  final _signupPasswordController = TextEditingController();
  final _signupOrgController = TextEditingController();
  bool _signupObscure = true;
  bool _isSigningUp = false;

  static const _blue = Color(0xff4f52ea);

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _loginEmailController.dispose();
    _loginPasswordController.dispose();
    _signupNameController.dispose();
    _signupEmailController.dispose();
    _signupPasswordController.dispose();
    _signupOrgController.dispose();
    super.dispose();
  }

  Future<void> _handleSignIn() async {
    final email = _loginEmailController.text.trim();
    final password = _loginPasswordController.text.trim();

    if (email.isEmpty || password.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter your email and password.')),
      );
      return;
    }

    setState(() => _isLoggingIn = true);
    final success = await AuthService.instance.signIn(email, password);
    if (!mounted) return;
    setState(() => _isLoggingIn = false);

    if (success) {
      Navigator.of(context).pushNamedAndRemoveUntil(
        AppRoutes.dashboard,
        (route) => false,
      );
    }
  }

  Future<void> _handleSignUp() async {
    final name = _signupNameController.text.trim();
    final email = _signupEmailController.text.trim();
    final password = _signupPasswordController.text.trim();
    final org = _signupOrgController.text.trim();

    if (name.isEmpty || email.isEmpty || password.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fill in Name, Email, and Password.')),
      );
      return;
    }

    setState(() => _isSigningUp = true);
    final success = await AuthService.instance.signUp(
      name: name,
      email: email,
      password: password,
      orgName: org.isNotEmpty ? org : "$name's Workspace",
    );
    if (!mounted) return;
    setState(() => _isSigningUp = false);

    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Account created successfully! Welcome to Nexus AI.'),
          backgroundColor: Color(0xff10b981),
        ),
      );
      Navigator.of(context).pushNamedAndRemoveUntil(
        AppRoutes.dashboard,
        (route) => false,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBg = isDark ? const Color(0xff0e1626) : Colors.white;
    final borderColor = isDark ? const Color(0xff1e293b) : const Color(0xffe2e8f0);

    return Scaffold(
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 480),
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const SizedBox(height: 8),

                  // ── App Brand Header ──
                  Center(
                    child: Column(
                      children: [
                        Container(
                          width: 68,
                          height: 68,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(20),
                            boxShadow: [
                              BoxShadow(
                                color: const Color(0xff4341cf).withValues(alpha: 0.35),
                                blurRadius: 18,
                                offset: const Offset(0, 6),
                              ),
                            ],
                          ),
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(20),
                            child: Image.asset(
                              'assets/icons/app_icon.png',
                              fit: BoxFit.cover,
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),
                        const Text(
                          'Nexus AI',
                          style: TextStyle(fontSize: 26, fontWeight: FontWeight.w900, letterSpacing: -0.5),
                        ),
                        const SizedBox(height: 4),
                        const Text(
                          'Universal Adaptive Intelligence Platform',
                          style: TextStyle(fontSize: 12, color: Color(0xff64748b)),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // ── Tab Switcher (Sign In vs Sign Up) ──
                  Container(
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xff090d16) : const Color(0xfff1f5f9),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: borderColor),
                    ),
                    child: TabBar(
                      controller: _tabController,
                      indicator: BoxDecoration(
                        color: _blue,
                        borderRadius: BorderRadius.circular(14),
                      ),
                      labelColor: Colors.white,
                      unselectedLabelColor: const Color(0xff64748b),
                      labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                      tabs: const [
                        Tab(text: 'Sign In'),
                        Tab(text: 'Create Account'),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  // ── Tab Content Form Container ──
                  Container(
                    padding: const EdgeInsets.all(22),
                    decoration: BoxDecoration(
                      color: cardBg,
                      borderRadius: BorderRadius.circular(22),
                      border: Border.all(color: borderColor),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: isDark ? 0.3 : 0.04),
                          blurRadius: 20,
                          offset: const Offset(0, 6),
                        ),
                      ],
                    ),
                    child: SizedBox(
                      height: 380,
                      child: TabBarView(
                        controller: _tabController,
                        children: [
                          _buildSignInTab(isDark),
                          _buildSignUpTab(isDark),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Quick Demo Credentials Hint
                  Center(
                    child: TextButton.icon(
                      onPressed: () {
                        setState(() {
                          _loginEmailController.text = 'jaswant@nexus.ai';
                          _loginPasswordController.text = 'password123';
                        });
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Demo credentials loaded (jaswant@nexus.ai)')),
                        );
                      },
                      icon: const Icon(Icons.flash_on_rounded, size: 16, color: _blue),
                      label: const Text('Autofill Demo Account', style: TextStyle(color: _blue, fontSize: 12)),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSignInTab(bool isDark) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          TextField(
            controller: _loginEmailController,
            keyboardType: TextInputType.emailAddress,
            decoration: const InputDecoration(
              labelText: 'Email Address',
              hintText: 'user@nexus.ai',
              prefixIcon: Icon(Icons.mail_outline_rounded, size: 20),
            ),
          ),
          const SizedBox(height: 14),
          TextField(
            controller: _loginPasswordController,
            obscureText: _loginObscure,
            decoration: InputDecoration(
              labelText: 'Password',
              prefixIcon: const Icon(Icons.lock_outline_rounded, size: 20),
              suffixIcon: IconButton(
                icon: Icon(_loginObscure ? Icons.visibility_outlined : Icons.visibility_off_outlined, size: 20),
                onPressed: () => setState(() => _loginObscure = !_loginObscure),
              ),
            ),
          ),
          const SizedBox(height: 6),
          Align(
            alignment: Alignment.centerRight,
            child: TextButton(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Password reset link sent to registered email.')),
                );
              },
              child: const Text('Forgot password?', style: TextStyle(fontSize: 12)),
            ),
          ),
          const SizedBox(height: 10),
          FilledButton(
            style: FilledButton.styleFrom(
              backgroundColor: _blue,
              padding: const EdgeInsets.symmetric(vertical: 15),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
            ),
            onPressed: _isLoggingIn ? null : _handleSignIn,
            child: _isLoggingIn
                ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                : const Text('Sign In to Nexus', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
          ),
          const SizedBox(height: 12),
          OutlinedButton.icon(
            style: OutlinedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 13),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
            ),
            onPressed: _handleSignIn,
            icon: const Icon(Icons.fingerprint_rounded, size: 20),
            label: const Text('Sign in with Biometrics', style: TextStyle(fontSize: 13)),
          ),
        ],
      ),
    );
  }

  Widget _buildSignUpTab(bool isDark) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          TextField(
            controller: _signupNameController,
            decoration: const InputDecoration(
              labelText: 'Full Name',
              hintText: 'e.g. Jaswant Karun',
              prefixIcon: Icon(Icons.person_outline_rounded, size: 20),
            ),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _signupEmailController,
            keyboardType: TextInputType.emailAddress,
            decoration: const InputDecoration(
              labelText: 'Work Email',
              hintText: 'jaswant@company.com',
              prefixIcon: Icon(Icons.mail_outline_rounded, size: 20),
            ),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _signupPasswordController,
            obscureText: _signupObscure,
            decoration: InputDecoration(
              labelText: 'Create Password (min 8 chars)',
              prefixIcon: const Icon(Icons.lock_outline_rounded, size: 20),
              suffixIcon: IconButton(
                icon: Icon(_signupObscure ? Icons.visibility_outlined : Icons.visibility_off_outlined, size: 20),
                onPressed: () => setState(() => _signupObscure = !_signupObscure),
              ),
            ),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _signupOrgController,
            decoration: const InputDecoration(
              labelText: 'Organization / Company Name (Optional)',
              hintText: 'e.g. Nexus AI Labs',
              prefixIcon: Icon(Icons.business_rounded, size: 20),
            ),
          ),
          const SizedBox(height: 18),
          FilledButton(
            style: FilledButton.styleFrom(
              backgroundColor: _blue,
              padding: const EdgeInsets.symmetric(vertical: 15),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
            ),
            onPressed: _isSigningUp ? null : _handleSignUp,
            child: _isSigningUp
                ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                : const Text('Create Nexus Account', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }
}
