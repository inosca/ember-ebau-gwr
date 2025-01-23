import { inject as service } from "@ember/service";
import BuildingEntrance from "ember-ebau-gwr/models/building-entrance";

import IndexRoute from "./edit/index";

export default class BuildingEditEntranceNewRoute extends IndexRoute {
  @service buildingEntrance;
  @service street;
  @service intl;

  templateName = "building.edit.entrance.edit.index";
  controllerName = "building.edit.entrance.edit.index";

  model() {
    const model = this.modelFor("building.edit");

    const buildingEntrance = new BuildingEntrance();
    buildingEntrance.locality.name.language = this.street.language;
    buildingEntrance.EGID = model.buildingId;
    return {
      ...model,
      entranceId: "new",
      buildingEntrance,
    };
  }
}
