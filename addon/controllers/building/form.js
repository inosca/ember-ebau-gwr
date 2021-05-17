import Controller from "@ember/controller";
import { inject as service } from "@ember/service";
import { task, lastValue } from "ember-concurrency-decorators";
import Models from "ember-ebau-gwr/models";

export default class BuildingFormController extends Controller {
  Models = Models;

  @service gwr;
  @service intl;
  @service notification;

  get buildingStatusOptions() {
    // TODO Every other status need the building to be saved when the project is created.
    return this.model.buildingWork?.isNew
      ? [
          1004, // Bestehend
          1005, // Nicht nutzbar
        ]
      : Models.Building.buildingStatusOptions;
  }

  @lastValue("fetchBuilding") buildingWork;
  @task
  *fetchBuilding() {
    try {
      if (this.model.buildingWork?.isNew) {
        return this.model.buildingWork;
      }

      const project = yield this.gwr.getFromCacheOrApi(this.model.projectId);
      return project.work?.find(
        (buildingWork) =>
          buildingWork.building.EGID === Number(this.model.buildingId)
      );
    } catch (error) {
      console.error(error);
      this.notification.danger(this.intl.t("ember-gwr.linkedBuildings.error"));
    }
  }

  @task
  *saveBuilding() {
    try {
      let EGID = this.buildingWork.building.EGID;
      if (this.buildingWork.isNew) {
        const building = yield this.gwr.addBuilding(this.buildingWork.building);
        EGID = building.EGID;
      } else {
        yield this.gwr.updateBuilding(this.buildingWork.building);
      }
      yield this.gwr.bindBuildingToConstructionProject(
        this.model.projectId,
        EGID,
        this.buildingWork
      );
      // Clear cache so after transition we fetch the project form api
      this.gwr.clearCache(this.model.projectId);
      this.transitionToRoute("building.form", EGID);
      this.notification.success(this.intl.t("ember-gwr.building.saveSuccess"));
    } catch (error) {
      console.error(error);
      this.notification.danger(this.intl.t("ember-gwr.building.saveError"));
    }
  }

  @task
  *linkBuilding() {
    try {
      yield this.gwr.bindBuildingToConstructionProject(
        this.model.projectId,
        this.buildingWork.building.EGID,
        this.buildingWork
      );
      // Invalidate project so the data is newly fetched with the updated building.
      this.gwr.clearCache(this.model.projectId);
      this.notification.success(
        this.intl.t("ember-gwr.searchBuilding.linkSuccess")
      );
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t("ember-gwr.searchBuilding.linkError")
      );
    }
  }
}
