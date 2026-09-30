import 'package:flutter/services.dart';
import 'package:local_auth/local_auth.dart';
import 'package:shared_preferences/shared_preferences.dart';

class BiometricAuthResult {
  final bool success;
  final String message;
  final bool isSupported;
  final bool isEnrolled;

  const BiometricAuthResult({
    required this.success,
    required this.message,
    this.isSupported = true,
    this.isEnrolled = true,
  });
}

class BiometricService {
  static final LocalAuthentication _auth = LocalAuthentication();
  static const String _prefKeyBiometricEnabled = 'nexus_biometric_enabled';
  static const String _prefKeyLastBiometricUser = 'nexus_last_biometric_user';

  /// Check whether the device hardware supports biometrics (fingerprint / face)
  static Future<bool> isDeviceSupported() async {
    try {
      final isSupported = await _auth.isDeviceSupported();
      final canCheck = await _auth.canCheckBiometrics;
      return isSupported && canCheck;
    } catch (_) {
      return false;
    }
  }

  /// Check available enrolled biometric methods
  static Future<List<BiometricType>> getAvailableBiometrics() async {
    try {
      return await _auth.getAvailableBiometrics();
    } catch (_) {
      return <BiometricType>[];
    }
  }

  /// Whether biometric login is turned on in Nexus settings
  static Future<bool> isBiometricsEnabled() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return prefs.getBool(_prefKeyBiometricEnabled) ?? true;
    } catch (_) {
      return true;
    }
  }

  /// Set biometric setting preference
  static Future<void> setBiometricsEnabled(bool enabled) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool(_prefKeyBiometricEnabled, enabled);
    } catch (_) {}
  }

  /// Save last successfully authenticated email/user
  static Future<void> saveLastUser(String email) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_prefKeyLastBiometricUser, email);
    } catch (_) {}
  }

  /// Get last user signed in with biometrics
  static Future<String?> getLastUser() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return prefs.getString(_prefKeyLastBiometricUser);
    } catch (_) {
      return null;
    }
  }

  /// Execute biometric authentication with graceful fallback
  static Future<BiometricAuthResult> authenticate({
    String reason = 'Verify your identity to sign in to Nexus AI',
  }) async {
    try {
      final isSupported = await _auth.isDeviceSupported();
      final canCheck = await _auth.canCheckBiometrics;

      if (!isSupported && !canCheck) {
        return const BiometricAuthResult(
          success: false,
          isSupported: false,
          message: 'Biometric hardware is not available on this device.',
        );
      }

      final available = await _auth.getAvailableBiometrics();
      if (available.isEmpty) {
        return const BiometricAuthResult(
          success: false,
          isSupported: true,
          isEnrolled: false,
          message: 'No biometrics enrolled. Please register fingerprint or face in device settings.',
        );
      }

      final authenticated = await _auth.authenticate(
        localizedReason: reason,
        persistAcrossBackgrounding: true,
        biometricOnly: false,
      );

      if (authenticated) {
        return const BiometricAuthResult(
          success: true,
          message: 'Biometric authentication successful.',
        );
      } else {
        return const BiometricAuthResult(
          success: false,
          message: 'Authentication canceled or not recognized.',
        );
      }
    } on PlatformException catch (e) {
      return BiometricAuthResult(
        success: false,
        message: 'Biometric error: ${e.message ?? e.code}',
      );
    } catch (e) {
      return BiometricAuthResult(
        success: false,
        message: 'Unable to authenticate biometrics: $e',
      );
    }
  }
}
