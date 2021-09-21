import { inject as service } from "@ember/service";
import Changeset from "ember-changeset";
import lookupValidator from "ember-changeset-validations";
import BuildingEntrance from "ember-ebau-gwr/models/building-entrance";
import BuildingWork from "ember-ebau-gwr/models/building-work";
import municipalities from "ember-ebau-gwr/models/municipalities";
import { buildingWorkValidation } from "ember-ebau-gwr/validations/building-work";

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
    const model = { projectId: this.modelFor("building") };
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

    // Reuse changeset if already exists, otherwise changes on building
    // are lost after setting street
    if (!this.building.newRecord) {
      this.building.newRecord = new Changeset(
        buildingWork,
        lookupValidator(buildingWorkValidation(true)),
        buildingWorkValidation(true)
      );
    }

    model.buildingWork = buildingWork;
    return model;
  }
}
