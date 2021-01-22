import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | search-project', function(hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function(assert) {
    let controller = this.owner.lookup('controller:search-project');
    assert.ok(controller);
  });
});
