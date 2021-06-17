import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | building/edit/entrance/link-street', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:building/edit/entrance/link-street');
    assert.ok(route);
  });
});
