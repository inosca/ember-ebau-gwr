import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { task, dropTask, lastValue } from "ember-concurrency-decorators";
import Models from "ember-ebau-gwr/models";
import BuildingEntranceValidations from "ember-ebau-gwr/validations/building-entrance";

export default class BuildingEditEntranceEditIndexController extends Controller {
  queryParams = ["import", "index"];
  Models = Models;
  BuildingEntranceValidations = BuildingEntranceValidations;

  @service("building-entrance") buildingEntranceAPI;
  @service building;
  @service intl;
  @service notification;
  @service router;
  @service dataImport;

  @tracked import = false;
  @tracked index = undefined;
  @tracked errors;

  @lastValue("fetchBuildingEntrance") buildingEntrance;
  @task
  *fetchBuildingEntrance() {
    try {
      this.errors = [];
      let buildingEntrance;

      if (this.buildingEntranceAPI.newRecord) {
        buildingEntrance = this.buildingEntranceAPI.newRecord;
      } else {
        buildingEntrance = yield this.buildingEntranceAPI.getFromCacheOrApi(
          this.model.entranceId,
          this.model.buildingId
        );

        buildingEntrance.EGID = this.model.buildingId;
      }
      this.fetchCalumaData.perform();
      this.errors = [];
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

  @lastValue("fetchCalumaData") importData;
  @task
  *fetchCalumaData() {
    const data = yield this.dataImport.fetchEntrancesFromBuilding(
      this.model.buildingId
    );
    return data;
  }

  @action
  cancelMerge() {
    this.import = false;
    this.index = undefined;
    this.fetchBuildingEntrance.perform();
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
      this.errors = [];
      this.notification.success(
        this.intl.t("ember-gwr.buildingEntrance.saveSuccess")
      );
    } catch (error) {
      this.errors = error;
      this.notification.danger(
        this.intl.t("ember-gwr.buildingEntrance.saveError")
      );
    }
  }
}
