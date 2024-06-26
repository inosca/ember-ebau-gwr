import { setupTest } from "dummy/tests/helpers";
import { module, test } from "qunit";

module("Unit | Route | project/index", function (hooks) {
  setupTest(hooks);
  test("it exists", function (assert) {
    const route = this.engine.lookup("route:project/index");
    assert.ok(route);
  });
});
