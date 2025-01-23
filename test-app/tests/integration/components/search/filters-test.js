import { click, render } from "@ember/test-helpers";
import { Changeset } from "ember-changeset";
import { hbs } from "ember-cli-htmlbars";
import { module, test } from "qunit";

import { setupRenderingTest } from "test-app/tests/helpers";

module("Integration | Component | search/filters", function (hooks) {
  setupRenderingTest(hooks);

  test("it allows toggling of the extended search fields", async function (assert) {
    this.changeset = new Changeset({});
    this.onSubmit = { perform: () => {} };

    await render(
      hbs`
    <Search::Filters
      @changeset={{this.changeset}}
      @onSubmit={{this.onSubmit}}
      @extendedSearch={{true}}
    >
    </Search::Filters>`,
      { owner: this.engine },
    );

    assert.dom('input[name="realestateIdentification.EGRID"]').isNotVisible();

    await click("button");

    assert.dom('input[name="realestateIdentification.EGRID"]').isVisible();
  });
});
