import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Route | project/linked-buildings", function (hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
    const route = this.owner.lookup("route:project/linked-buildings");
    assert.ok(route);
  });
});
