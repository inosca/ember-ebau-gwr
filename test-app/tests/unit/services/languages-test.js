import { module, test } from "qunit";

import { setupTest } from "test-app/tests/helpers";

module("Unit | Service | languages", function (hooks) {
  setupTest(hooks);

  test("available languages for a given canton", function (assert) {
    const configService = this.engine.lookup("service:config");
    const languagesService = this.engine.lookup("service:languages");

    configService.cantonAbbreviation = "GR";

    assert.deepEqual(languagesService.availableLanguages, ["de", "rm", "it"]);

    configService.cantonAbbreviation = "BE";

    assert.deepEqual(languagesService.availableLanguages, ["de", "fr"]);
  });

  test("transforms language abbrevation to gwr API language code", function (assert) {
    const service = this.engine.lookup("service:languages");

    assert.strictEqual(service.languageToCode("de"), 9901);
    assert.strictEqual(service.languageToCode("rm"), 9902);
    assert.strictEqual(service.languageToCode("fr"), 9903);
    assert.strictEqual(service.languageToCode("it"), 9904);
  });

  test("transforms gwr API language code to language abbrevation", function (assert) {
    const service = this.engine.lookup("service:languages");

    assert.strictEqual(service.codeToLanguage(9901), "de");
    assert.strictEqual(service.codeToLanguage(9902), "rm");
    assert.strictEqual(service.codeToLanguage(9903), "fr");
    assert.strictEqual(service.codeToLanguage(9904), "it");
  });
});
