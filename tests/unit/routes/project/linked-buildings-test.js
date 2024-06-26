import { setupTest } from "dummy/tests/helpers";
import { module, test } from "qunit";

module("Unit | Route | project/linked-buildings", function (hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
    const route = this.engine.lookup("route:project/linked-buildings");
    assert.ok(route);
  });
});
