import { setupTest } from "dummy/tests/helpers";
import DataImportStub from "dummy/tests/helpers/data-import-stub";
import { module, test } from "qunit";

module("Unit | Controller | project/form", function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test("it exists", function (assert) {
    this.owner.register("service:dataImport", DataImportStub);
    const controller = this.owner.lookup("controller:project/form");
    assert.ok(controller);
  });
});
