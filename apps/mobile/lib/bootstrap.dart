import 'package:flutter/material.dart';
import 'config/api_config.dart';
import 'services/streak_service.dart';

Future<void> bootstrap() async {
  WidgetsFlutterBinding.ensureInitialized();
  await ApiConfig.init();
  await StreakService.recordDailyVisit();
  await Future<void>.delayed(const Duration(milliseconds: 150));
}
