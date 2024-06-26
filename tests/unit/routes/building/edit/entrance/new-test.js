import { setupTest } from "dummy/tests/helpers";
import { module, test } from "qunit";

module("Unit | Route | building/edit/entrance/new", function (hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
    const route = this.engine.lookup("route:building/edit/entrance/new");
    assert.ok(route);
  });
});
