import { module, test } from "qunit";

import { setupTest } from "dummy/tests/helpers";

module("Unit | Model | gwr link", function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test("it exists", function (assert) {
    const store = this.engine.lookup("service:store");
    const model = store.createRecord("gwr-link", {});
    assert.ok(model);
  });
});
