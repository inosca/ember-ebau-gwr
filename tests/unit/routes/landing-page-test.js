import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Route | global-landing-page", function (hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
    const route = this.owner.lookup("route:global-landing-page");
    assert.ok(route);
  });
});
