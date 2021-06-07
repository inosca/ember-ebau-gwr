<<<<<<< HEAD
import engineResolverFor from "ember-engines/test-support/engine-resolver-for";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

const modulePrefix = "ember-ebau-gwr";
const resolver = engineResolverFor(modulePrefix);
module("Unit | Service | building-entrance", function (hooks) {
  setupTest(hooks, { resolver, integration: true });

  // TODO: Replace this with your real tests.
  test("it exists", function (assert) {
    const service = this.owner.lookup("service:building-entrance");
=======
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | building-entrance', function(hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function(assert) {
    let service = this.owner.lookup('service:building-entrance');
>>>>>>> 9a35c74 (refactor(gwr-service): refactor into multiple services for code quality)
    assert.ok(service);
  });
});
