import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { Settings } from "luxon";
import { module, test } from "qunit";

import { setupRenderingTest } from "test-app/tests/helpers";

module("Integration | Helper | current-quarter", function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.oldNow = Settings.now;

    this.setNow = (iso) => {
      Settings.now = () => new Date(iso).getTime();
    };
  });

  hooks.afterEach(function () {
    Settings.now = this.oldNow;
  });

  test("it renders the correct quarter", async function (assert) {
    this.setNow("2022-01-01");
    await render(hbs`{{current-quarter}}`, { owner: this.engine });
    assert.dom(this.element).hasText("Q4");

    this.setNow("2022-06-30");
    await render(hbs`{{current-quarter}}`, { owner: this.engine });
    assert.dom(this.element).hasText("Q2");

    this.setNow("2022-09-19");
    await render(hbs`{{current-quarter}}`, { owner: this.engine });
    assert.dom(this.element).hasText("Q3");

    this.setNow("2022-12-20");
    await render(hbs`{{current-quarter}}`, { owner: this.engine });
    assert.dom(this.element).hasText("Q4");
  });

  test("it renders the correct quarter within the year", async function (assert) {
    this.setNow("2022-12-21");
    await render(hbs`{{current-quarter showYear=true}}`, {
      owner: this.engine,
    });

    assert.dom(this.element).hasText("Q4/2022");
  });

  test("it renders the correct quarter within the last year", async function (assert) {
    this.setNow("2022-01-11");
    await render(hbs`{{current-quarter showYear=true}}`, {
      owner: this.engine,
    });

    assert.dom(this.element).hasText("Q4/2021");
  });
});
