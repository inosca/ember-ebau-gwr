import Service, { inject as service } from "@ember/service";
import { languageOptions } from "ember-ebau-gwr/models/options";

export default class LanguagesService extends Service {
  @service config;

  languages = {
    AG: ["de"],
    AR: ["de"],
    AI: ["de"],
    BL: ["de"],
    BS: ["de"],
    BE: ["de", "fr"],
    FR: ["de", "fr"],
    GE: ["de", "fr"],
    GL: ["de"],
    GR: ["de", "rm", "it"],
    JU: ["fr"],
    LU: ["de"],
    NE: ["fr"],
    NW: ["de"],
    OW: ["de"],
    SH: ["de"],
    SZ: ["de"],
    SO: ["de"],
    SG: ["de"],
    TI: ["it"],
    TG: ["de"],
    UR: ["de"],
    VD: ["fr"],
    VS: ["de", "fr"],
    ZG: ["de"],
    ZH: ["de"],
  };

  get availableLanguages() {
    return this.config.cantonAbbreviation
      ? this.languages[this.config.cantonAbbreviation]
      : ["de", "rm", "fr", "it"];
  }

  codeToLanguage(code) {
    return Object.entries(languageOptions).find(
      ([, value]) => value === code,
    )[0];
  }

  languageToCode(languageAbbreviation) {
    return languageOptions[languageAbbreviation];
  }
}
