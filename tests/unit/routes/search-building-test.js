import { setupTest } from "dummy/tests/helpers";
import { module, test } from "qunit";

module("Unit | Route | search-building", function (hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
    const route = this.owner.lookup("route:search-building");
    assert.ok(route);
  });
});
