import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, todo } from "qunit";

module(
  "Integration | Component | search/result-table/head/header",
  function (hooks) {
    setupRenderingTest(hooks);

    todo("it renders", async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.set('myAction', function(val) { ... });

      await render(hbs`<Search::ResultTable::Head::Header />`);

      assert.equal(this.element.textContent.trim(), "");

      // Template block usage:
      await render(hbs`
      <Search::ResultTable::Head::Header>
        template block text
      </Search::ResultTable::Head::Header>
    `);

      assert.equal(this.element.textContent.trim(), "template block text");
    });
  }
);
