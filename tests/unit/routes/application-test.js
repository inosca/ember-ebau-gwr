import { module, test } from "qunit";

import { setupTest } from "dummy/tests/helpers";

module("Unit | Route | application", function (hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
    const route = this.engine.lookup("route:application");
    assert.ok(route);
  });
});
