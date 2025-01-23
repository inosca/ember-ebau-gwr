import { module, test } from "qunit";

import { setupTest } from "dummy/tests/helpers";

module("Unit | Service | construction-project", function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test("it exists", function (assert) {
    const service = this.engine.lookup("service:construction-project");
    assert.ok(service);
  });
});
