import { inject as service } from "@ember/service";
import BuildingEntrance from "ember-ebau-gwr/models/building-entrance";
import BuildingWork from "ember-ebau-gwr/models/building-work";
import municipalities from "ember-ebau-gwr/models/municipalities";

import BuildingFormRoute from "./edit/form";

const STATUS_PROJECTED = 1001;
const WORK_NEW = 6001;

export default class BuildingNewRoute extends BuildingFormRoute {
  @service building;
  @service config;
  @service intl;

  templateName = "building.edit.form";
  controllerName = "building.edit.form";

  async model() {
    const model = {
      instanceId: this.modelFor("application")?.id,
      projectId: this.modelFor("building"),
    };
    const buildingWork = new BuildingWork();
    await this.building.authFetch.housingStatToken.lastRunning;
    buildingWork.building.municipality = this.building.municipality;
    buildingWork.building.municipalityName = municipalities[
      this.config.cantonAbbreviation
    ].find((m) => m.id === Number(this.building.municipality))?.name;
    buildingWork.building.buildingStatus = STATUS_PROJECTED;
    buildingWork.kindOfWork = WORK_NEW;

    // Generate a editable first building entrance for new buildings
    // to prevent having to generate a dummy entrance
    buildingWork.building.buildingEntrance = new BuildingEntrance();

    model.buildingWork = buildingWork;
    return model;
  }
}
