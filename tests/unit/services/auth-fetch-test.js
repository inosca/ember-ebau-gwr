import engineResolverFor from "ember-engines/test-support/engine-resolver-for";
import { setupTest } from "ember-qunit";
import { module, todo } from "qunit";

const modulePrefix = "ember-ebau-gwr";
const resolver = engineResolverFor(modulePrefix);
module("Unit | Service | auth-fetch", function (hooks) {
  setupTest(hooks, { resolver, integration: true });

  // TODO: Replace this with your real tests.
  todo("it exists", function (assert) {
    const service = this.owner.lookup("service:auth-fetch");
    assert.ok(service);
  });
});
