import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import engineResolverFor from "ember-engines/test-support/engine-resolver-for";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

const modulePrefix = "ember-ebau-gwr";
const resolver = engineResolverFor(modulePrefix);

module("Integration | Component | instance-link", function (hooks) {
  setupRenderingTest(hooks, { resolver, integration: true });

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

    await render(hbs`<InstanceLink @links={{this.links}}/>`);

    assert.dom("a:first-of-type").hasText("identifier1");
    assert.dom("a:first-of-type").hasAttribute("href", "/hostLink1/localLink1");
    assert.dom("a:last-of-type").hasText("identifier2");
    assert.dom("a:last-of-type").hasAttribute("href", "/hostLink2/localLink2");
  });
});
