import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { task, dropTask, lastValue } from "ember-concurrency-decorators";
import Models from "ember-ebau-gwr/models";
import DwellingValidations from "ember-ebau-gwr/validations/dwelling";

export default class BuildingEditDwellingEditController extends Controller {
  Models = Models;
  DwellingValidations = DwellingValidations;

  @service("dwelling") dwellingAPI;
  @service building;
  @service intl;
  @service notification;
  @service router;

  @tracked errors;

  dwellingStatusOptions = Models.Dwelling.dwellingStatusOptions;

  get nextValidStates() {
    const states = this.dwellingAPI.nextValidStates(
      this.dwelling.dwellingStatus
    );
    return states;
  }

  @lastValue("fetchDwelling") dwelling;
  @task
  *fetchDwelling() {
    try {
      this.errors = [];

      yield this.fetchEntrances.perform();
      if (this.model.dwelling?.isNew) {
        this.model.dwelling.EDID = this.entrances[0].EDID;
        return this.model.dwelling;
      }

      const { EDID, dwelling } = yield this.dwellingAPI.getFromCacheOrApi(
        this.model.dwellingId,
        this.model.buildingId
      );
      dwelling.oldEDID = EDID;

      return dwelling;
    } catch (error) {
      console.error(error);
      this.notification.danger(this.intl.t("ember-gwr.dwelling.loadingError"));
    }
  }

  @lastValue("fetchEntrances") entrances;
  @task
  *fetchEntrances() {
    try {
      const building = yield this.building.getFromCacheOrApi(
        this.model.buildingId
      );
      return building.buildingEntrance;
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t("ember-gwr.building.entrances.error")
      );
    }
  }

  @dropTask
  *saveDwelling() {
    try {
      if (this.dwelling.isNew) {
        const dwelling = yield this.dwellingAPI.create(
          this.dwelling,
          this.model.buildingId
        );
        this.transitionToRoute("building.edit.dwelling.edit", dwelling.EWID);
      } else {
        yield this.dwellingAPI.update(this.dwelling, this.model.buildingId);
        if (this.dwelling.oldEDID !== this.dwelling.EDID) {
          yield this.dwellingAPI.reallocate(
            this.model.buildingId,
            this.dwelling
          );
        }
      }
      this.errors = [];
      this.notification.success(this.intl.t("ember-gwr.dwelling.saveSuccess"));
    } catch (error) {
      this.errors = error;
      this.notification.danger(this.intl.t("ember-gwr.dwelling.saveError"));
    }
  }

  @task
  *transitionState(currentStatus, newStatus) {
    try {
      yield this.dwellingAPI.transitionState(
        this.dwelling,
        currentStatus,
        newStatus,
        this.model.buildingId
      );
      yield this.dwellingAPI.clearCache(
        this.dwellingAPI.cacheKey(this.dwelling)
      );
      this.fetchDwelling.perform(); // reload for errors;
      this.notification.success(this.intl.t("ember-gwr.dwelling.saveSuccess"));
    } catch (error) {
      console.error(error);
      this.notification.danger(this.intl.t("ember-gwr.dwelling.saveError"));
      throw error;
    }
  }

  @action
  getChangeParameters(currentStatus, newStatus) {
    return this.dwellingAPI.getChangeParameters(currentStatus, newStatus);
  }

  @task
  *correctState() {
    try {
      yield this.dwellingAPI.update(this.dwelling, this.model.buildingId);
      yield this.dwellingAPI.clearCache(
        this.dwellingAPI.cacheKey(this.dwelling)
      );
      this.fetchDwelling.perform(); // reload for errors;

      this.notification.success(this.intl.t("ember-gwr.dwelling.saveSuccess"));
    } catch (error) {
      console.error(error);
      this.notification.danger(this.intl.t("ember-gwr.dwelling.saveError"));
      throw error;
    }
  }
  @action
  getCorrectionParameters(newStatus) {
    return this.dwellingAPI.getCorrectionParameters(newStatus);
  }
}
