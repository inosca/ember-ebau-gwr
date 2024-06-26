import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "dummy/tests/helpers";
import { hbs } from "ember-cli-htmlbars";
import { module, todo } from "qunit";

module("Integration | Component | login-modal", function (hooks) {
  setupRenderingTest(hooks);

  todo("it renders", async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<LoginModal />`, { owner: this.engine });

    assert.equal(this.element.textContent.trim(), "");

    // Template block usage:
    await render(
      hbs`
      <LoginModal>
        template block text
      </LoginModal>
    `,
      { owner: this.engine },
    );

    assert.equal(this.element.textContent.trim(), "template block text");
  });
});
