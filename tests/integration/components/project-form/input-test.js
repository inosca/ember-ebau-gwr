import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, todo } from "qunit";

module("Integration | Component | project-form/input", function (hooks) {
  setupRenderingTest(hooks);

  todo("it renders", async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<ProjectForm::Input />`);

    assert.equal(this.element.textContent.trim(), "");

    // Template block usage:
    await render(hbs`
      <ProjectForm::Input>
        template block text
      </ProjectForm::Input>
    `);

    assert.equal(this.element.textContent.trim(), "template block text");
  });
});
