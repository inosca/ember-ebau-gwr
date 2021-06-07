import Controller from "@ember/controller";
import Models from "ember-ebau-gwr/models";
import { inject as service } from "@ember/service";
import { task, lastValue } from "ember-concurrency-decorators";

export default class BuildingEditEntranceEditController extends Controller {
  Models = Models;

  @service building;
  @service intl;
  @service notification;

  @lastValue("fetchBuildingEntrance") buildingEntrance;
  @task
  *fetchBuildingEntrance() {
    try {
      if (this.model.buildingEntrance?.isNew) {
        return this.model.buildingEntrance;
      }

      const building = yield this.building.getFromCacheOrApi(
        this.model.buildingId
      );
      return building.buildingEntrance.find(
        (buildingEntrance) =>
          buildingEntrance.EGAID === Number(this.model.entranceId)
      );
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t("ember-gwr.buildingEntrance.errors.loading")
      );
    }
  }

  @task
  *saveBuildingEntrance() {}
}
