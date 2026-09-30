import 'package:flutter_test/flutter_test.dart';
import 'package:nexus_mobile/services/auth_service.dart';

void main() {
  test('AuthService biometric sign in creates valid session', () async {
    final success = await AuthService.instance.signInBiometric('jaswant@nexus.ai');
    expect(success, isTrue);
    expect(AuthService.instance.isAuthenticated, isTrue);
    expect(AuthService.instance.currentUser?.name, equals('Jaswant Karun'));
  });
}
