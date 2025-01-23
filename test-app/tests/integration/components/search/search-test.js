import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { module, todo } from "qunit";

import { setupRenderingTest } from "test-app/tests/helpers";

module("Integration | Component | Search", function (hooks) {
  setupRenderingTest(hooks);

  todo("it renders FilterInputs", async function (assert) {
    await render(hbs`<Search/>`, { owner: this.engine });

    assert.equal(this.element.textContent.trim(), "");

    // Template block usage:
    await render(
      hbs`
      <Search::ResultTable>
        template block text
      </Search::ResultTable>
    `,
      { owner: this.engine },
    );

    assert.equal(this.element.textContent.trim(), "template block text");

    assert.ok(false);
  });
  // todo("calls the supplied service search function with the correct arguments");
});
