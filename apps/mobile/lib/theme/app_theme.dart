import 'package:flutter/material.dart';

/// Global controller to switch themes reactively across the whole mobile app.
final ValueNotifier<ThemeMode> themeNotifier = ValueNotifier<ThemeMode>(ThemeMode.dark);

class AppTheme {
  const AppTheme._();

  // ── Palette Constants ──
  static const Color primary = Color(0xff4f52ea);
  static const Color primaryLight = Color(0xff6366f1);
  static const Color accentCyan = Color(0xff06b6d4);
  static const Color accentEmerald = Color(0xff10b981);

  // ── Obsidian Dark Theme (Exact match to Web App from Screenshot) ──
  static ThemeData get darkTheme {
    const bg = Color(0xff090d16); // web dark:bg-[#090d16]
    const card = Color(0xff0e1626); // web dark card #0e1626
    const border = Color(0xff1e293b); // web dark:border-slate-800
    const inner = Color(0xff070a12);

    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: bg,
      canvasColor: bg,
      cardColor: card,
      dividerColor: border,
      colorScheme: const ColorScheme.dark(
        primary: primary,
        secondary: accentCyan,
        surface: card,
        surfaceContainer: card,
        surfaceContainerHigh: card,
        surfaceContainerHighest: border,
        outline: border,
        onSurface: Colors.white,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: bg,
        foregroundColor: Colors.white,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.w800,
          color: Colors.white,
          letterSpacing: -0.3,
        ),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: Color(0xff090d16),
        selectedItemColor: primaryLight,
        unselectedItemColor: Color(0xff64748b),
        type: BottomNavigationBarType.fixed,
        elevation: 12,
      ),
      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: const Color(0xff090d16),
        indicatorColor: primary.withValues(alpha: 0.25),
        iconTheme: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return const IconThemeData(color: primaryLight);
          }
          return const IconThemeData(color: Color(0xff94a3b8));
        }),
        labelTextStyle: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: primaryLight);
          }
          return const TextStyle(fontSize: 11, fontWeight: FontWeight.normal, color: Color(0xff94a3b8));
        }),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: inner,
        labelStyle: const TextStyle(color: Color(0xff94a3b8), fontSize: 13),
        hintStyle: const TextStyle(color: Color(0xff64748b), fontSize: 13),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: border),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: primary, width: 1.5),
        ),
      ),
      dialogTheme: DialogThemeData(
        backgroundColor: card,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20), side: const BorderSide(color: border)),
      ),
      cardTheme: CardThemeData(
        color: card,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(18),
          side: const BorderSide(color: border),
        ),
      ),
    );
  }

  // ── Daylight Light Theme ──
  static ThemeData get lightTheme {
    const bg = Color(0xfff8fafc);
    const surface = Colors.white;
    const card = Colors.white;
    const border = Color(0xffe2e8f0);

    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      scaffoldBackgroundColor: bg,
      colorScheme: const ColorScheme.light(
        primary: Color(0xff4341cf),
        secondary: accentCyan,
        surface: surface,
        surfaceContainerHighest: Color(0xfff1f5f9),
        outline: border,
        onSurface: Color(0xff0f172a),
      ),
      cardColor: card,
      dividerColor: border,
      appBarTheme: const AppBarTheme(
        backgroundColor: surface,
        foregroundColor: Color(0xff0f172a),
        elevation: 0,
        centerTitle: false,
        titleTextStyle: TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.w800,
          color: Color(0xff0f172a),
          letterSpacing: -0.3,
        ),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: Colors.white,
        selectedItemColor: Color(0xff4341cf),
        unselectedItemColor: Color(0xff94a3b8),
        type: BottomNavigationBarType.fixed,
        elevation: 8,
      ),
      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: Colors.white,
        indicatorColor: const Color(0xff4341cf).withValues(alpha: 0.12),
        iconTheme: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return const IconThemeData(color: Color(0xff4341cf));
          }
          return const IconThemeData(color: Color(0xff64748b));
        }),
        labelTextStyle: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xff4341cf));
          }
          return const TextStyle(fontSize: 11, fontWeight: FontWeight.normal, color: Color(0xff64748b));
        }),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white,
        labelStyle: const TextStyle(color: Color(0xff64748b), fontSize: 13),
        hintStyle: const TextStyle(color: Color(0xff94a3b8), fontSize: 13),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: border),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: Color(0xff4341cf), width: 1.5),
        ),
      ),
      dialogTheme: DialogThemeData(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20), side: const BorderSide(color: border)),
      ),
      cardTheme: CardThemeData(
        color: card,
        elevation: 2,
        shadowColor: Colors.black.withValues(alpha: 0.04),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(18),
          side: const BorderSide(color: border),
        ),
      ),
    );
  }
}
