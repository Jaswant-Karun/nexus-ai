import 'package:flutter/material.dart';
import 'config/api_config.dart';

Future<void> bootstrap() async {
  WidgetsFlutterBinding.ensureInitialized();
  await ApiConfig.init();
  await Future<void>.delayed(const Duration(milliseconds: 150));
}
