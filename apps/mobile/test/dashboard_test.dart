import 'package:flutter_test/flutter_test.dart';
import 'package:nexus_mobile/services/streak_service.dart';

void main() {
  test('Dashboard streak initial data is non-null', () {
    expect(StreakService.streakNotifier.value.currentStreak, greaterThanOrEqualTo(1));
    expect(StreakService.streakNotifier.value.past30Days, isNotEmpty);
  });
}
