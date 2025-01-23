import Dwelling from "ember-ebau-gwr/models/dwelling";

import DwellingEditRoute from "./edit";

const DWELLING_PROJECTED = 3001;

export default class BuildingEditDwellingNewRoute extends DwellingEditRoute {
  templateName = "building.edit.dwelling.edit";
  controllerName = "building.edit.dwelling.edit";

  model() {
    const model = this.modelFor("building.edit");
    const dwelling = new Dwelling();
    dwelling.dwellingStatus = DWELLING_PROJECTED;
    return { ...model, dwelling };
  }
}
