import Controller from "@ember/controller";
import { inject as service } from "@ember/service";
import { task, lastValue } from "ember-concurrency-decorators";
import Models from "ember-ebau-gwr/models";
import BuildingWorkValidations from "ember-ebau-gwr/validations/building-work";

const EXISTING = 1004,
  NOT_USABLE = 1005;

export default class BuildingFormController extends Controller {
  Models = Models;
  BuildingWorkValidations = BuildingWorkValidations;

  @service constructionProject;
  @service building;
  @service intl;
  @service notification;

  get buildingStatusOptions() {
    // TODO Every other status need the building to be saved when the project is created.
    return this.model.buildingWork?.isNew
      ? [EXISTING, NOT_USABLE]
      : Models.Building.buildingStatusOptions;
  }

  @lastValue("fetchBuilding") buildingWork;
  @task
  *fetchBuilding() {
    try {
      if (this.model.buildingWork?.isNew) {
        return this.model.buildingWork;
      }

      const project = yield this.constructionProject.getFromCacheOrApi(
        this.model.projectId
      );
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
  *saveBuildingWork() {
    try {
      let EGID = this.buildingWork.building.EGID;
      if (this.buildingWork.isNew) {
        const building = yield this.building.create(this.buildingWork.building);
        EGID = building.EGID;
      } else {
        yield this.building.update(this.buildingWork.building);
      }
      yield this.building.bindBuildingToConstructionProject(
        this.model.projectId,
        EGID,
        this.buildingWork
      );
      // Clear cache so after transition we fetch the project form api
      this.constructionProject.clearCache(this.model.projectId);
      this.transitionToRoute("building.edit.form", EGID);
      this.notification.success(this.intl.t("ember-gwr.building.saveSuccess"));
    } catch (error) {
      console.error(error);
      this.notification.danger(this.intl.t("ember-gwr.building.saveError"));
    }
  }

  @task
  *linkBuilding() {
    try {
      yield this.building.bindBuildingToConstructionProject(
        this.model.projectId,
        this.buildingWork.building.EGID,
        this.buildingWork
      );
      // Invalidate project so the data is newly fetched with the updated building.
      this.constructionProject.clearCache(this.model.projectId);
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
