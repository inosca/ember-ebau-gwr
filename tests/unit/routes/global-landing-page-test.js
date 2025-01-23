import { module, test } from "qunit";

import { setupTest } from "dummy/tests/helpers";

module("Unit | Route | global-landing-page", function (hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
    const route = this.engine.lookup("route:global-landing-page");
    assert.ok(route);
  });
});
