import { getOwner } from "@ember/application";
import Modifier from "ember-modifier";
import { inject as service } from "@ember/service";

export default class ConfigurableClasses extends Modifier {
  @service config;

  didReceiveArguments() {
    const configuredClasses = this.config.cssClasses;

    this.args.positional.forEach((cssClass) => {
      const classesToAdd = configuredClasses?.[cssClass] ?? "";

      this.element.classList.add(
        ...(Array.isArray(classesToAdd) ? classesToAdd : [classesToAdd])
      );
    });
  }
}
