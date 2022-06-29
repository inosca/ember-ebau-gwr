import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Route | landing-page", function (hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
    const route = this.owner.lookup("route:landing-page");
    assert.ok(route);
  });
});
