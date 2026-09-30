import 'package:flutter_test/flutter_test.dart';
import 'package:nexus_mobile/core/local_ml_engine.dart';
import 'package:nexus_mobile/config/api_config.dart';
import 'package:nexus_mobile/services/streak_service.dart';

void main() {
  group('LocalMlEngine Offline Tests', () {
    test('Correctly classifies and answers pronoun comparison', () {
      final res = LocalMlEngine.infer('Compare He and She');
      expect(res.intent, equals('comparison_linguistics'));
      expect(res.response, contains('Comprehensive Comparison'));
      expect(res.reasoningSteps, isNotEmpty);
    });

    test('Correctly classifies and answers reverse linked list in python', () {
      final res = LocalMlEngine.infer('Write a Python function to reverse a linked list');
      expect(res.intent, equals('coding_algorithms'));
      expect(res.response, contains('def reverse_linked_list'));
      expect(res.reasoningSteps.length, equals(5));
    });

    test('Correctly classifies and answers neural network inquiry', () {
      final res = LocalMlEngine.infer('Explain how neural networks learn');
      expect(res.intent, equals('ai_machine_learning'));
      expect(res.response, contains('Forward Propagation'));
      expect(res.response, contains('Backpropagation'));
    });

    test('Correctly classifies and answers REST API design', () {
      final res = LocalMlEngine.infer('Design a REST API for a todo app');
      expect(res.intent, equals('system_design'));
      expect(res.response, contains('/api/v1/todos'));
    });

    test('Answers open domain questions gracefully', () {
      final res = LocalMlEngine.infer('What is quantum computing?');
      expect(res.response, contains('Detailed Analysis: What is quantum computing'));
    });
  });

  group('StreakService Tests', () {
    test('Calculates and records daily streak correctly', () async {
      final streak = await StreakService.recordDailyVisit();
      expect(streak.currentStreak, greaterThanOrEqualTo(1));
      expect(streak.past30Days.length, equals(30));
      expect(streak.past30Days.last.isActive, isTrue);
    });
  });

  group('ApiConfig Host Resolution Tests', () {
    test('Defaults to valid host and sets custom host', () async {
      expect(ApiConfig.currentHost, isNotEmpty);
      await ApiConfig.setHost('192.168.1.100');
      expect(ApiConfig.currentHost, equals('192.168.1.100'));
      expect(ApiConfig.webApiBaseUrl, equals('http://192.168.1.100:3000'));
      expect(ApiConfig.backendBaseUrl, equals('http://192.168.1.100:8000'));
    });
  });
}
