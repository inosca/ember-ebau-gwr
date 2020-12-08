import Helper from "@ember/component/helper";
import { inject as service } from "@ember/service";

export default class ConfiguredClasses extends Helper {
  @service config;

  compute(classes) {
    return classes
      .map((cssClass) => {
        const classesToAdd = this.config.cssClasses?.[cssClass] ?? "";

        if (Array.isArray(classesToAdd)) {
          return classesToAdd.join(" ");
        }

        return classesToAdd;
      })
      .join(" ");
  }
}
