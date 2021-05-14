import Controller from "@ember/controller";
import { inject as service } from "@ember/service";
import { task } from "ember-concurrency-decorators";
import Models from "ember-ebau-gwr/models";

export default class BuildingFormController extends Controller {
  Models = Models;

  @service gwr;
  @service intl;
  @service notification;

  get building() {
    return this.fetchBuilding.lastSuccessful?.value?.building;
  }

  get project() {
    return this.fetchBuilding.lastSuccessful?.value?.project;
  }

  @task
  *fetchBuilding() {
    try {
      const project = yield this.gwr.getFromCacheOrApi(this.model.projectId);
      return {
        project,
        building: project.work?.find(
          (buildingWork) =>
            buildingWork.building.EGID === Number(this.model.buildingId)
        )?.building,
      };
    } catch (error) {
      console.error(error);
      this.notification.danger(this.intl.t("ember-gwr.linkedBuildings.error"));
    }
  }

  @task
  *saveBuilding() {
    try {
      yield this.gwr.updateBuilding(this.building);
      // Invalidate project so the data is newly fetched with the updated building.
      this.gwr.clearCache(this.model.projectId);
      this.notification.success(this.intl.t("ember-gwr.building.saveSuccess"));
    } catch (error) {
      console.error(error);
      this.notification.danger(this.intl.t("ember-gwr.building.saveError"));
    }
  }
}
