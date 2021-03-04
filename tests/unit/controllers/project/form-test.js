import DataImportStub from "dummy/tests/helpers/data-import-stub";
import engineResolverFor from "ember-engines/test-support/engine-resolver-for";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

const modulePrefix = "ember-ebau-gwr";
const resolver = engineResolverFor(modulePrefix);
module("Unit | Controller | project/form", function (hooks) {
  setupTest(hooks, { resolver, integration: true });

  // TODO: Replace this with your real tests.
  test("it exists", function (assert) {
    this.owner.register("service:dataImport", DataImportStub);
    const controller = this.owner.lookup("controller:project/form");
    assert.ok(controller);
  });
});
