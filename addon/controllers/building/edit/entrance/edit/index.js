import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { task, dropTask, lastValue } from "ember-concurrency";
import ImportController from "ember-ebau-gwr/controllers/import";
import Models from "ember-ebau-gwr/models";
import BuildingEntranceValidations from "ember-ebau-gwr/validations/building-entrance";

export default class BuildingEditEntranceEditIndexController extends ImportController {
  Models = Models;
  BuildingEntranceValidations = BuildingEntranceValidations;

  @service("building-entrance") buildingEntranceAPI;
  @service building;
  @service intl;
  @service notification;
  @service router;
  @service config;

  @tracked errors;

  @lastValue("fetchBuildingEntrance") buildingEntrance;
  @task
  *fetchBuildingEntrance() {
    try {
      this.errors = [];
      if (this.model.buildingEntrance?.isNew) {
        return this.model.buildingEntrance;
      }
      const buildingEntrance = yield this.buildingEntranceAPI.getFromCacheOrApi(
        this.model.entranceId,
        this.model.buildingId,
      );

      buildingEntrance.EGID = this.model.buildingId;
      return buildingEntrance;
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t("ember-gwr.buildingEntrance.loadingError"),
      );
    }
  }

  @action
  cancelMerge() {
    this.resetImportQueryParams();
    this.fetchBuildingEntrance.perform();
  }

  @action
  syncLocalityWithSelectedStreet(changeset, streetList) {
    changeset.set("locality.street", streetList);
    changeset.set("locality.name.nameLong", streetList.locality.name.nameLong);
    changeset.set("locality.swissZipCode", streetList.locality.swissZipCode);
    changeset.set(
      "locality.swissZipCodeAddOn",
      streetList.locality.swissZipCodeAddOn,
    );
  }

  @dropTask
  *saveBuildingEntrance() {
    try {
      if (this.buildingEntrance.isNew) {
        const buildingEntrance = yield this.buildingEntranceAPI.create(
          this.buildingEntrance,
          this.model.buildingId,
        );
        this.router.transitionTo(
          "building.edit.entrance.edit",
          buildingEntrance.EDID,
        );
      } else {
        yield this.buildingEntranceAPI.update(
          this.buildingEntrance,
          this.model.buildingId,
        );
      }
      // Ensure building entrance list is refreshed
      this.building.clearCache(this.model.buildingId);
      this.errors = [];
      this.notification.success(
        this.intl.t("ember-gwr.buildingEntrance.saveSuccess"),
      );
    } catch (error) {
      this.errors = error;
      this.notification.danger(
        this.intl.t("ember-gwr.buildingEntrance.saveError"),
      );
    }
  }

  get hasNoStreet() {
    return !this.buildingEntrance?.isNew && this.buildingEntrance?.street.isNew;
  }
}
