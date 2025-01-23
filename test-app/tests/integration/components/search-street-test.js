import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { selectChoose } from "ember-power-select/test-support";
import {
  typeInSearch,
  clickTrigger,
} from "ember-power-select/test-support/helpers";
import { module, test } from "qunit";

import { setupRenderingTest } from "test-app/tests/helpers";

module("Integration | Component | search-street", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    this.set("street");
    this.set("options", {
      locality: {
        swissZipCode: "8862",
        swissZipCodeAddOn: "",
      },
    });
    this.set("disabled", true);
    this.update = (street) => {
      assert.step("updateStreet");
      this.set("street", street);
    };

    const testQueryTerm = "burg";

    const service = this.engine.lookup("service:street");
    service.search = (query) => {
      assert.deepEqual(query, {
        description: {
          descriptionLong: `*${testQueryTerm}*`,
        },
        locality: {
          swissZipCode: "8862",
          swissZipCodeAddOn: "",
        },
        language: 9901,
      });

      return [
        {
          description: {
            descriptionLong: "Eisenburgstrasse",
          },
          ESID: "1234",
        },
      ];
    };

    await render(
      hbs`<SearchStreet
      @options={{this.options}}
      @value={{this.street}}
      @disabled={{this.disabled}}
      @required={{true}}
      @on-update={{this.update}}
      class="test-search"
    />`,
      { owner: this.engine },
    );

    //disabled state
    assert.dom("label").hasText("Strassenname *");
    assert
      .dom("[data-test-hint]")
      .hasText("Bitte geben Sie zuerst Ihre PLZ an.");

    this.set("disabled", false);
    assert.dom("[data-test-hint]").isNotVisible();

    await clickTrigger();
    await typeInSearch(testQueryTerm);
    await selectChoose(".test-search", ".ember-power-select-option", 0);

    assert.verifySteps(["updateStreet"]);
    assert
      .dom(".ember-power-select-selected-item")
      .containsText("Eisenburgstrasse");
    assert
      .dom(
        ".ember-power-select-selected-item [data-test-search-street-locality-name]",
      )
      .hasText("Ortsname: ,");
    assert
      .dom(".ember-power-select-selected-item [data-test-search-street-esid]")
      .hasText("ESID: 1234");
  });
});
