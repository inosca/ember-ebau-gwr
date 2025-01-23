import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { module, test } from "qunit";

import { setupRenderingTest } from "test-app/tests/helpers";

module("Integration | Helper | build-url", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    this.owner.mountPoint = "my-engine";
    this.engine.lookup("service:router").urlFor = (routeName, model) => {
      assert.strictEqual(routeName, "some.route");
      assert.strictEqual(model, "model");

      return "/";
    };

    await render(hbs`{{build-url "some.route" (array "model")}}`, {
      owner: this.engine,
    });

    assert.dom(this.element).hasText("/");
  });
});
