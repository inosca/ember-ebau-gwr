import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Route | building/edit/index", function (hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
    const route = this.owner.lookup("route:building/edit/index");
    assert.ok(route);
  });
});
