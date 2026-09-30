import 'package:flutter_test/flutter_test.dart';
import 'package:nexus_mobile/core/local_ml_engine.dart';
import 'package:nexus_mobile/config/api_config.dart';

void main() {
  test('Integration test: config and local ML work seamlessly', () {
    expect(ApiConfig.currentHost, isNotEmpty);
    final res = LocalMlEngine.infer('Hello NEXUS');
    expect(res.response, isNotEmpty);
  });
}
