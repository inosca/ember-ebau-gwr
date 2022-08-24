import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, todo } from "qunit";

module("Integration | Component | Search", function (hooks) {
  setupRenderingTest(hooks);

  todo("it renders FilterInputs", async function (assert) {
    await render(hbs`<Search/>`);

    assert.equal(this.element.textContent.trim(), "");

    // Template block usage:
    await render(hbs`
      <Search::ResultTable>
        template block text
      </Search::ResultTable>
    `);

    assert.equal(this.element.textContent.trim(), "template block text");
  });
  // todo("calls the supplied service search function with the correct arguments");
});
