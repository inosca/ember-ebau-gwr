import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "dummy/tests/helpers";
import { hbs } from "ember-cli-htmlbars";
import { module, test } from "qunit";

module("Integration | Helper | build-url", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    assert.expect(3);

    this.owner.mountPoint = "my-engine";
    this.owner.lookup("service:router").urlFor = (routeName, model) => {
      assert.strictEqual(routeName, "some.route");
      assert.strictEqual(model, "model");

      return "/";
    };

    await render(hbs`{{build-url "some.route" (array "model")}}`);

    assert.dom(this.element).hasText("/");
  });
});
