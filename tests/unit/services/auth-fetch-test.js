import { module, test } from "qunit";

import { setupTest } from "dummy/tests/helpers";
import SessionStub from "dummy/tests/helpers/session-stub";

module("Unit | Service | auth-fetch", function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test("it exists", function (assert) {
    this.owner.register("service:session", SessionStub);
    const service = this.engine.lookup("service:auth-fetch");
    assert.ok(service);
  });
});
