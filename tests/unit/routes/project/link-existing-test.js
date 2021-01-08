import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | project/link-existing', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:project/link-existing');
    assert.ok(route);
  });
});
