import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Route | building/edit/entrance/link-street", function (hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
    const route = this.owner.lookup("route:building/edit/entrance/link-street");
    assert.ok(route);
  });
});
