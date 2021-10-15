import Helper from "@ember/component/helper";
import { inject as service } from "@ember/service";
import ENV from "ember-ebau-gwr/config/environment";

export default class HousingStatLink extends Helper {
  @service config;

  compute() {
    return this.config.isTestEnvironment === false
      ? ENV.housingStatLinkProd
      : ENV.housingStatLinkTest;
  }
}
