import { setupMirage } from "ember-cli-mirage/test-support";
import { setupEngine } from "ember-engines/test-support";
import { setupIntl } from "ember-intl/test-support";
import {
  setupApplicationTest as upstreamSetupApplicationTest,
  setupRenderingTest as upstreamSetupRenderingTest,
  setupTest as upstreamSetupTest,
} from "ember-qunit";
import UIkit from "uikit";

// This file exists to provide wrappers around ember-qunit's
// test setup functions. This way, you can easily extend the setup that is
// needed per test type.

function setupApplicationTest(hooks, options) {
  upstreamSetupApplicationTest(hooks, options);
  setupIntl(hooks, "de");
  setupEngine(hooks, "ember-ebau-gwr");
  setupMirage(hooks);

  hooks.beforeEach(function () {
    UIkit.container = this.owner.rootElement;
  });
}

function setupRenderingTest(hooks, options) {
  upstreamSetupRenderingTest(hooks, options);
  setupIntl(hooks, "de");
  setupEngine(hooks, "ember-ebau-gwr");
  setupMirage(hooks);

  hooks.beforeEach(function () {
    UIkit.container = this.owner.rootElement;
  });
}

function setupTest(hooks, options) {
  upstreamSetupTest(hooks, options);
  setupEngine(hooks, "ember-ebau-gwr");
  setupMirage(hooks);
}

export { setupApplicationTest, setupRenderingTest, setupTest };
