import { module, test } from "qunit";

import { setupTest } from "dummy/tests/helpers";

module("Unit | Route | building", function (hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
    const route = this.engine.lookup("route:building");
    assert.ok(route);
  });
});
