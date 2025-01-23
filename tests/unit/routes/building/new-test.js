import { module, test } from "qunit";

import { setupTest } from "dummy/tests/helpers";

module("Unit | Route | building/new", function (hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
    const route = this.engine.lookup("route:building/new");
    assert.ok(route);
  });
});
