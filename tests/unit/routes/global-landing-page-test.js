import { setupTest } from "dummy/tests/helpers";
import { module, test } from "qunit";

module("Unit | Route | global-landing-page", function (hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
    const route = this.engine.lookup("route:global-landing-page");
    assert.ok(route);
  });
});
