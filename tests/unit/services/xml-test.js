import { setupTest } from "dummy/tests/helpers";
import { module, test } from "qunit";

module("Unit | Service | xml", function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test("it exists", function (assert) {
    const service = this.engine.lookup("service:xml");
    assert.ok(service);
  });
});
