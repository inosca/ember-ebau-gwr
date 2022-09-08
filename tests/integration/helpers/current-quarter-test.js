import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import engineResolverFor from "ember-engines/test-support/engine-resolver-for";
import { setupRenderingTest } from "ember-qunit";
import { DateTime } from "luxon";
import { module, test } from "qunit";

const modulePrefix = "ember-ebau-gwr";
const resolver = engineResolverFor(modulePrefix);
module("Integration | Helper | current-quarter", function (hooks) {
  setupRenderingTest(hooks, { resolver, integration: true });

  test("it renders the correct quarter", async function (assert) {
    this.week = DateTime.fromISO("2022-01-01").toFormat("W");
    await render(hbs`{{current-quarter currentWeek=this.week}}`);
    assert.dom(this.element).hasText("Q4");

    this.week = DateTime.fromISO("2022-06-30").toFormat("W");
    await render(hbs`{{current-quarter currentWeek=this.week}}`);
    assert.dom(this.element).hasText("Q2");

    this.week = DateTime.fromISO("2022-09-19").toFormat("W");
    await render(hbs`{{current-quarter currentWeek=this.week}}`);
    assert.dom(this.element).hasText("Q3");

    this.week = DateTime.fromISO("2022-12-20").toFormat("W");
    await render(hbs`{{current-quarter currentWeek=this.week}}`);
    assert.dom(this.element).hasText("Q4");
  });

  test("it renders the correct quarter whith the year", async function (assert) {
    this.week = DateTime.fromISO("2022-12-21").toFormat("W");
    await render(hbs`{{current-quarter currentWeek=this.week showYear=true}}`);

    assert.dom(this.element).hasText("Q4/2022");
  });

  test("it renders the correct quarter whith the last year", async function (assert) {
    this.week = DateTime.fromISO("2022-01-11").toFormat("W");
    await render(hbs`{{current-quarter currentWeek=this.week showYear=true}}`);

    assert.dom(this.element).hasText("Q4/2021");
  });
});
