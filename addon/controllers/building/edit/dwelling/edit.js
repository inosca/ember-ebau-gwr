import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { task, dropTask, lastValue } from "ember-concurrency-decorators";
import Models from "ember-ebau-gwr/models";
import Dwelling from "ember-ebau-gwr/models/dwelling";
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

  concatStates(states) {
    if (states.length === 1) {
      return this.intl.t(`ember-gwr.lifeCycles.states.${states[0]}`);
    }
    const tail = states.pop();
    return `${states
      .map((state) => this.intl.t(`ember-gwr.lifeCycles.states.${state}`))
      .join(", ")} ${this.intl.t("ember-gwr.general.or")} ${this.intl.t(
      `ember-gwr.lifeCycles.states.${tail}`
    )}`;
  }

  @task
  *transitionState(currentStatus, newStatus) {
    try {
      const transition =
        Dwelling.dwellingTransitionMapping[currentStatus][newStatus];

      // execute dry-run, throws error if requirements don't hold
      yield this.dwellingAPI[transition](
        transition,
        1,
        true,
        this.dwelling,
        this.model.buildingId
      );

      // execute transition(s)
      // cascade level:
      // 1: only perform transition on dwelling
      yield this.dwellingAPI[transition](
        transition,
        1,
        false,
        this.dwelling,
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

      if (error.isLifeCycleError) {
        const errorType = error.dwellingId
          ? "statusErrorDwelling"
          : "statusErrorBuilding";
        throw [
          this.intl.t(`ember-gwr.lifeCycles.${errorType}`, {
            dwellingId: error.dwellingId,
            buildingId: error.buildingId,
            states: this.concatStates(error.states),
            href: error.dwellingId
              ? `/${this.model.instanceId}/${this.model.projectId}/building/${error.buildingId}/dwelling/${error.dwellingId}`
              : `/${this.model.instanceId}/${this.model.projectId}/building/${error.buildingId}/form`,
            htmlSafe: true,
          }),
        ];
      }

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
