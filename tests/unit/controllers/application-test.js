import { setupTest } from "dummy/tests/helpers";
import { module, test } from "qunit";

module("Unit | Controller | application", function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test("it exists", function (assert) {
    const controller = this.engine.lookup("controller:application");
    assert.ok(controller);
  });
});
