import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | building/edit', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:building/edit');
    assert.ok(route);
  });
});
