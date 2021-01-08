import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Helper | configured-classes", function (hooks) {
  setupRenderingTest(hooks);

  // TODO: Replace this with your real tests.
  test("it renders", async function (assert) {
    this.set("inputValue", "1234");

    await render(hbs`{{configured-classes inputValue}}`);

    assert.equal(this.element.textContent.trim(), "1234");
  });
});
