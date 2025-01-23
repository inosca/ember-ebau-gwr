import { module, test } from "qunit";

import { setupTest } from "dummy/tests/helpers";

module("Unit | Route | project/index", function (hooks) {
  setupTest(hooks);
  test("it exists", function (assert) {
    const route = this.engine.lookup("route:project/index");
    assert.ok(route);
  });
});
