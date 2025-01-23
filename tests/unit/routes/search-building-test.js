import { module, test } from "qunit";

import { setupTest } from "dummy/tests/helpers";

module("Unit | Route | search-building", function (hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
    const route = this.engine.lookup("route:search-building");
    assert.ok(route);
  });
});
