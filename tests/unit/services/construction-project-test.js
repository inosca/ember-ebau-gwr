import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Service | construction-project", function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test("it exists", function (assert) {
    const service = this.owner.lookup("service:construction-project");
    assert.ok(service);
  });
});
