import 'package:flutter/material.dart';

import 'screens/dashboard/dashboard_screen.dart';

class NexusApp extends StatelessWidget {
	const NexusApp({super.key});

	@override
	Widget build(BuildContext context) {
		return MaterialApp(
			title: 'Nexus AI',
			debugShowCheckedModeBanner: false,
			theme: ThemeData(
				useMaterial3: true,
				colorScheme: ColorScheme.fromSeed(
					seedColor: const Color(0xff2d6cdf),
					brightness: Brightness.light,
				),
				scaffoldBackgroundColor: const Color(0xfff5f7fb),
			),
			home: const DashboardScreen(),
		);
	}
}
