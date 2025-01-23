import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { module, test } from "qunit";

import { setupRenderingTest } from "test-app/tests/helpers";

module("Integration | Component | instance-link", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders instance links", async function (assert) {
    this.links = [
      {
        eproid: 1,
        localId: 1,
        identifier: "identifier1",
        hostLink: "/hostLink1",
        localLink: "/localLink1",
      },
      {
        eproid: 1,
        localId: 2,
        identifier: "identifier2",
        hostLink: "/hostLink2",
        localLink: "/localLink2",
      },
    ];

    await render(hbs`<InstanceLink @links={{this.links}}/>`, {
      owner: this.engine,
    });

    assert.dom("a:first-of-type").hasText("identifier1");
    assert.dom("a:first-of-type").hasAttribute("href", "/hostLink1/localLink1");
    assert.dom("a:last-of-type").hasText("identifier2");
    assert.dom("a:last-of-type").hasAttribute("href", "/hostLink2/localLink2");
  });
});
