import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { task, dropTask, lastValue } from "ember-concurrency-decorators";
import Models from "ember-ebau-gwr/models";
import Building from "ember-ebau-gwr/models/building";
import { buildingWorkValidation } from "ember-ebau-gwr/validations/building-work";

export default class BuildingFormController extends Controller {
  queryParams = ["import", "index"];
  Models = Models;
  BuildingWorkValidations = buildingWorkValidation(false);

  @service constructionProject;
  @service("building") buildingAPI;
  @service dwelling;
  @service intl;
  @service notification;
  @service dataImport;

  @tracked import = false;
  @tracked index = undefined;
  @tracked errors;

  get buildingStatusOptions() {
    return Models.Building.buildingStatusOptions;
  }

  get nextValidStates() {
    const states = this.buildingAPI.nextValidStates(
      this.building.buildingStatus
    );
    return states;
  }

  @lastValue("fetchBuildingWork") buildingWork;
  @task
  *fetchBuildingWork() {
    try {
      this.errors = [];
      yield this.fetchBuilding.perform();

      if (this.model.buildingWork?.isNew) {
        return this.buildingAPI.newRecord ?? this.model.buildingWork;
      }

      const project = yield this.constructionProject.getFromCacheOrApi(
        this.model.projectId
      );

      yield this.fetchBuilding.perform();
      this.fetchCalumaData.perform();

      return project.work?.find(
        (buildingWork) =>
          buildingWork.building.EGID === Number(this.model.buildingId)
      );
    } catch (error) {
      console.error(error);
      this.notification.danger(this.intl.t("ember-gwr.linkedBuildings.error"));
    }
  }

  @lastValue("fetchBuilding") building;
  @task
  *fetchBuilding() {
    this.errors = [];
    if (this.model.buildingWork?.isNew) {
      return this.model.buildingWork.building;
    }

    const building = yield this.buildingAPI.getFromCacheOrApi(
      this.model.buildingId
    );
    return building;
  }

  @lastValue("fetchCalumaData") importData;
  @task
  *fetchCalumaData() {
    const data = yield this.dataImport.fetchBuildingsFromProject(
      this.model.projectId
    );
    return data;
  }

  @action
  cancelMerge() {
    this.import = false;
    this.index = undefined;
    this.fetchBuildingWork.perform();
  }

  @dropTask
  *saveBuildingWork() {
    try {
      let EGID = this.buildingWork.building.EGID;
      if (this.buildingWork.isNew) {
        const building = yield this.buildingAPI.create(
          this.model.projectId,
          this.buildingWork
        );
        EGID = building.EGID;
      } else {
        yield this.buildingAPI.update(this.buildingWork.building);
        // Only modify work if of type Umbau (only possible there)
        if (this.buildingWork.kindOfWork === 6002) {
          yield this.constructionProject.modifyWork(
            this.model.projectId,
            this.buildingWork
          );
        }
      }

      // refresh work list
      const project = yield this.constructionProject.get(this.model.projectId);

      // remove default work
      // Since all works have per default a new building model,
      // we can figure out the default work by filtering `building.isNew`.
      yield Promise.all(
        project.work.map((work) =>
          work.building.isNew
            ? this.constructionProject.removeWorkFromProject(
                this.model.projectId,
                work.ARBID
              )
            : work
        )
      );

      // Clear cache so after transition we fetch the project form api
      this.constructionProject.clearCache(this.model.projectId);
      this.buildingAPI.clearCache(this.model.buildingId);
      this.errors = [];
      this.transitionToRoute("building.edit.form", EGID);
      this.notification.success(this.intl.t("ember-gwr.building.saveSuccess"));
    } catch (error) {
      this.errors = error;
      this.notification.danger(this.intl.t("ember-gwr.building.saveError"));
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
  *transitionState(currentStatus, newStatus, isCascading) {
    try {
      const transition =
        Building.buildingTransitionMapping[currentStatus][newStatus];

      // reload in case linked objects have been updated
      const building = yield this.buildingAPI.get(this.model.buildingId);
      this.building.buildingEntrance = building.buildingEntrance;

      // update buildingWork with building modified by changeset
      this.buildingWork.building = this.building;

      // execute dry-run, throws error if requirements don't hold
      yield this.buildingAPI[transition](
        transition,
        2,
        true,
        this.buildingWork
      );

      // execute transition(s)
      // cascade level:
      // 2: execute transition on linked dwellings
      // 1: only perform transition on building
      yield this.buildingAPI[transition](
        transition,
        isCascading ? 2 : 1,
        false,
        this.buildingWork
      );

      yield this.buildingAPI.clearCache(this.model.buildingId);
      this.fetchBuilding.perform(); // reload for errors;
      this.notification.success(this.intl.t("ember-gwr.building.saveSuccess"));
    } catch (error) {
      console.error(error);
      this.notification.danger(this.intl.t("ember-gwr.building.saveError"));

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
    return this.buildingAPI.getChangeParameters(currentStatus, newStatus);
  }

  @task
  *correctState() {
    try {
      yield this.buildingAPI.update(this.building);
      yield this.buildingAPI.clearCache(this.model.buildingId);
      this.fetchBuilding.perform(); // reload for errors;
      this.notification.success(this.intl.t("ember-gwr.building.saveSuccess"));
    } catch (error) {
      console.error(error);
      this.notification.danger(this.intl.t("ember-gwr.building.saveError"));
      throw error;
    }
  }

  @action
  getCorrectionParameters(newStatus) {
    return this.buildingAPI.getCorrectionParameters(newStatus);
  }

  @action
  getChangeHint(currentStatus, newStatus) {
    return this.buildingAPI.getChangeHint(currentStatus, newStatus);
  }
}
