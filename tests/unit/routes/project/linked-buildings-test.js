import { module, test } from "qunit";

import { setupTest } from "dummy/tests/helpers";

module("Unit | Route | project/linked-buildings", function (hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
    const route = this.engine.lookup("route:project/linked-buildings");
    assert.ok(route);
  });
});
