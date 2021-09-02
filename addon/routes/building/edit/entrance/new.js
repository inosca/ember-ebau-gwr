import { inject as service } from "@ember/service";
import Changeset from "ember-changeset";
import lookupValidator from "ember-changeset-validations";
import BuildingEntrance from "ember-ebau-gwr/models/building-entrance";
import { languageOptions } from "ember-ebau-gwr/models/options";
import BuildingEntranceValidations from "ember-ebau-gwr/validations/building-entrance";

import IndexRoute from "./edit/index";

export default class BuildingEditEntranceNewRoute extends IndexRoute {
  @service buildingEntrance;
  @service intl;

  templateName = "building.edit.entrance.edit.index";
  controllerName = "building.edit.entrance.edit.index";

  async model() {
    const model = this.modelFor("building.edit");
    // Dont reset if there is already a new record
    if (!this.buildingEntrance.newRecord) {
      const buildingEntrance = new BuildingEntrance();
      buildingEntrance.locality.name.language =
        languageOptions[this.intl.primaryLocale];
      buildingEntrance.EGID = model.buildingId;

      this.buildingEntrance.newRecord = new Changeset(
        buildingEntrance,
        lookupValidator(BuildingEntranceValidations),
        BuildingEntranceValidations
      );
    }
    return { ...model, entranceId: "new" };
  }
}
