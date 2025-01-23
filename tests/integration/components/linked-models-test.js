import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { module, todo } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";

module("Integration | Component | linked-models", function (hooks) {
  setupRenderingTest(hooks);

  todo("it renders", async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<LinkedModels />`, { owner: this.engine });

    assert.equal(this.element.textContent.trim(), "");

    // Template block usage:
    await render(
      hbs`
      <LinkedModels>
        template block text
      </LinkedModels>
    `,
      { owner: this.engine },
    );

    assert.equal(this.element.textContent.trim(), "template block text");
  });
});
