import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { module, todo } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";

module("Integration | Component | project-nav", function (hooks) {
  setupRenderingTest(hooks);

  todo("it renders", async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<ProjectNav />`, { owner: this.engine });

    assert.dom(this.element).hasText("");

    // Template block usage:
    await render(
      hbs`
      <ProjectNav>
        template block text
      </ProjectNav>
    `,
      { owner: this.engine },
    );

    assert.dom(this.element).hasText("template block text");
  });
});
