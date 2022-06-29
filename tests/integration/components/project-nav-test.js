import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, todo } from "qunit";

module("Integration | Component | project-nav", function (hooks) {
  setupRenderingTest(hooks);

  todo("it renders", async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<ProjectNav />`);

    assert.dom(this.element).hasText("");

    // Template block usage:
    await render(hbs`
      <ProjectNav>
        template block text
      </ProjectNav>
    `);

    assert.dom(this.element).hasText("template block text");
  });
});
