import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Route | project/link-existing", function (hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
    const route = this.owner.lookup("route:project/link-existing");
    assert.ok(route);
  });
});
