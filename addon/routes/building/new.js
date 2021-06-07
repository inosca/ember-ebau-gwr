import { inject as service } from "@ember/service";
import BuildingWork from "ember-ebau-gwr/models/building-work";
import municipalities from "ember-ebau-gwr/models/municipalities";

import BuildingFormRoute from "./form";

export default class BuildingNewRoute extends BuildingFormRoute {
  @service building;
  @service config;

  templateName = "building.form";
  controllerName = "building.form";

  async model(...args) {
    const model = super.model(...args);
    const buildingWork = new BuildingWork();
    await this.building.authFetch.housingStatToken.lastRunning;
    buildingWork.building.municipality = this.building.municipality;
    buildingWork.building.municipalityName = municipalities[
      this.config.cantonAbbreviation
    ].find((m) => m.id === Number(this.building.municipality))?.name;
    model.buildingWork = buildingWork;
    return model;
  }
}
