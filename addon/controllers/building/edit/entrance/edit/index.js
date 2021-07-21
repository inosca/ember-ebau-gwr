import Controller from "@ember/controller";
import { inject as service } from "@ember/service";
import { task, dropTask, lastValue } from "ember-concurrency-decorators";
import Models from "ember-ebau-gwr/models";
import BuildingEntranceValidations from "ember-ebau-gwr/validations/building-entrance";

export default class BuildingEditEntranceEditIndexController extends Controller {
  Models = Models;
  BuildingEntranceValidations = BuildingEntranceValidations;

  @service("building-entrance") buildingEntranceAPI;
  @service building;
  @service intl;
  @service notification;

  @lastValue("fetchBuildingEntrance") buildingEntrance;
  @task
  *fetchBuildingEntrance() {
    try {
      if (this.buildingEntranceAPI.newRecord) {
        return this.buildingEntranceAPI.newRecord;
      }

      return yield this.buildingEntranceAPI.getFromCacheOrApi(
        this.model.entranceId,
        this.model.buildingId
      );
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t("ember-gwr.buildingEntrance.loadingError")
      );
    }
  }

  @dropTask
  *saveBuildingEntrance() {
    try {
      if (this.buildingEntrance.isNew) {
        const buildingEntrance = yield this.buildingEntranceAPI.create(
          this.buildingEntrance,
          this.model.buildingId
        );
        this.transitionToRoute(
          "building.edit.entrance.edit",
          buildingEntrance.EDID
        );
      } else {
        yield this.buildingEntranceAPI.update(
          this.buildingEntrance,
          this.model.buildingId
        );
      }
      this.notification.success(
        this.intl.t("ember-gwr.buildingEntrance.saveSuccess")
      );
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t("ember-gwr.buildingEntrance.saveError")
      );
    }
  }
}
