import 'package:flutter/material.dart';

Future<void> bootstrap() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Future<void>.delayed(const Duration(milliseconds: 250));
}
