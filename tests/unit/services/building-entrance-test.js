import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Service | building-entrance", function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test("it exists", function (assert) {
    const service = this.owner.lookup("service:building-entrance");
    assert.ok(service);
  });
});