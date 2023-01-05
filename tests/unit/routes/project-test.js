import { setupTest } from "dummy/tests/helpers";
import { module, test } from "qunit";

module("Unit | Route | project", function (hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
    const route = this.owner.lookup("route:project");
    assert.ok(route);
  });
});
