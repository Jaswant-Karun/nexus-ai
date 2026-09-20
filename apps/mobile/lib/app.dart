import 'package:flutter/material.dart';

import 'config/routes.dart';
import 'screens/analytics/analytics_dashboard.dart';
import 'screens/authentication/login_screen.dart';
import 'screens/dashboard/dashboard_screen.dart';
import 'screens/guide/how_to_use_screen.dart';
import 'screens/knowledge/knowledge_screen.dart';
import 'screens/notifications/notification_list.dart';
import 'screens/onboarding/onboarding_screen.dart';
import 'screens/profile/profile_screen.dart';
import 'screens/projects/project_details.dart';
import 'screens/settings/settings_screen.dart';
import 'screens/splash/splash_screen.dart';
import 'screens/tokens/token_screen.dart';
import 'screens/workflows/workflow_list.dart';
import 'theme/app_theme.dart';

class NexusApp extends StatelessWidget {
  const NexusApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<ThemeMode>(
      valueListenable: themeNotifier,
      builder: (context, currentMode, _) {
        return MaterialApp(
          title: 'Nexus AI',
          debugShowCheckedModeBanner: false,
          theme: AppTheme.lightTheme,
          darkTheme: AppTheme.darkTheme,
          themeMode: currentMode,
          initialRoute: AppRoutes.splash,
          routes: {
            AppRoutes.splash: (_) => const SplashScreen(),
            AppRoutes.onboarding: (_) => const OnboardingScreen(),
            AppRoutes.login: (_) => const LoginScreen(),
            AppRoutes.register: (_) => const LoginScreen(),
            AppRoutes.dashboard: (_) => const DashboardScreen(),
            AppRoutes.profile: (_) => const ProfileScreen(),
            AppRoutes.settings: (_) => const SettingsScreen(),
            AppRoutes.notifications: (_) => const NotificationListScreen(),
            AppRoutes.projectDetails: (_) => const ProjectDetailsScreen(),
            AppRoutes.analytics: (_) => const AnalyticsDashboardScreen(),
            AppRoutes.workflows: (_) => const WorkflowListScreen(),
            AppRoutes.knowledge: (_) => const KnowledgeScreen(),
            AppRoutes.howToUse: (_) => const HowToUseScreen(),
            AppRoutes.tokens: (_) => const TokenScreen(),
          },
        );
      },
    );
  }
}
