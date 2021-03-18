import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Route | building/form", function (hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
    const route = this.owner.lookup("route:building/form");
    assert.ok(route);
  });
});
