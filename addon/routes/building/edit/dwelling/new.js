import Dwelling from "ember-ebau-gwr/models/dwelling";

import DwellingEditRoute from "./edit";

export default class BuildingEditDwellingNewRoute extends DwellingEditRoute {
  templateName = "building.edit.dwelling.edit";
  controllerName = "building.edit.dwelling.edit";

  async model() {
    const model = this.modelFor("building.edit");
    const dwelling = new Dwelling();
    return { ...model, dwelling };
  }
}
