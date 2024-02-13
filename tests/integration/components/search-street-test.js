import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "dummy/tests/helpers";
import { hbs } from "ember-cli-htmlbars";
import {
  typeInSearch,
  clickTrigger,
  selectChoose,
} from "ember-power-select/test-support/helpers";
import { module, test } from "qunit";

module("Integration | Component | search-street", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    this.set("street");
    this.set("locality", {
      swissZipCode: "8862",
      swissZipCodeAddOn: "",
      name: {
        nameLong: "Schübelbach",
      },
    });
    this.set("disabled", true);
    this.update = (street) => {
      assert.step("updateStreet");
      this.set("street", street);
    };

    const testQueryTerm = "burg";

    const service = this.owner.lookup("service:street");
    service.search = (query) => {
      assert.deepEqual(query, {
        description: {
          descriptionLong: `*${testQueryTerm}*`,
        },
        locality: {
          swissZipCode: "8862",
          swissZipCodeAddOn: "",
          name: {
            nameLong: "Schübelbach",
          },
        },
        language: undefined,
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

    await render(hbs`<SearchStreet
      @locality={{this.locality}}
      @street={{this.street}}
      @disabled={{this.disabled}}
      @required={{true}}
      @onChange={{this.update}}
      class="test-search"
    />`);

    //disabled state
    assert
      .dom("label")
      .hasText(
        "t:ember-gwr.buildingEntrance.fields.street.description.descriptionLong:() *",
      );
    assert
      .dom("[data-test-hint]")
      .hasText("t:ember-gwr.components.streetSearch.requiredInputs:()");

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
      .dom(".ember-power-select-selected-item [data-test-street-esid]")
      .hasText("t:ember-gwr.street.ESID:(): 1234");
  });
});
