import engineResolverFor from "ember-engines/test-support/engine-resolver-for";
import {
  setupApplicationTest as upstreamSetupApplicationTest,
  setupRenderingTest as upstreamSetupRenderingTest,
  setupTest as upstreamSetupTest,
} from "ember-qunit";
import UIkit from "uikit";

const resolver = engineResolverFor("ember-ebau-gwr");

// This file exists to provide wrappers around ember-qunit's / ember-mocha's
// test setup functions. This way, you can easily extend the setup that is
// needed per test type.

function setupApplicationTest(hooks, options) {
  upstreamSetupApplicationTest(hooks, { ...options, resolver });

  hooks.beforeEach(function () {
    UIkit.container = this.owner.rootElement;
  });
}

function setupRenderingTest(hooks, options) {
  upstreamSetupRenderingTest(hooks, { ...options, resolver });

  hooks.beforeEach(function () {
    UIkit.container = this.owner.rootElement;
  });
}

function setupTest(hooks, options) {
  upstreamSetupTest(hooks, { ...options, resolver });
}

export { setupApplicationTest, setupRenderingTest, setupTest };
