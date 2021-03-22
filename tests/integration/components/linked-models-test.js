import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import engineResolverFor from "ember-engines/test-support/engine-resolver-for";
import { setupRenderingTest } from "ember-qunit";
import { module, todo } from "qunit";

const modulePrefix = "ember-ebau-gwr";
const resolver = engineResolverFor(modulePrefix);

module("Integration | Component | linked-models", function (hooks) {
  setupRenderingTest(hooks, { resolver, integration: true });

  todo("it renders", async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<LinkedModels />`);

    assert.equal(this.element.textContent.trim(), "");

    // Template block usage:
    await render(hbs`
      <LinkedModels>
        template block text
      </LinkedModels>
    `);

    assert.equal(this.element.textContent.trim(), "template block text");
  });
});
