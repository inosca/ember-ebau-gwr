import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { task, dropTask, lastValue } from "ember-concurrency";
import ImportController from "ember-ebau-gwr/controllers/import";
import Models from "ember-ebau-gwr/models";
import Building from "ember-ebau-gwr/models/building";
import { buildingWorkValidation } from "ember-ebau-gwr/validations/building-work";
import { trackedFunction } from "reactiveweb/function";

export default class BuildingFormController extends ImportController {
  Models = Models;

  @service constructionProject;
  @service("building") buildingAPI;
  @service dwelling;
  @service gwr;
  @service intl;
  @service notification;
  @service router;

  @tracked BuildingWorkValidations = trackedFunction(this, () => {
    return buildingWorkValidation({
      isNew: this.model.buildingWork?.isNew,
      validateOnlyBuilding: this.hasNoProject,
    });
  });

  @tracked errors;

  get buildingStatusOptions() {
    return Models.Building.buildingStatusOptions;
  }

  get nextValidStates() {
    const states = this.buildingAPI.nextValidStates(
      this.building.buildingStatus,
    );
    return states;
  }

  get hasNoProject() {
    return !this.model.projectId;
  }

  get statusConfiguration() {
    return { correction: true, change: this.hasProjectContext };
  }

  @lastValue("fetchBuildingWork") buildingWork;
  @task
  *fetchBuildingWork() {
    try {
      this.errors = [];

      yield this.fetchBuilding.perform();

      // If the edit view is accessed from the global search,
      // we dont have a buildingWork. In this case we just return
      // a mock building work.
      if (this.hasNoProject) {
        return { building: this.building };
      }

      if (this.model.buildingWork?.isNew) {
        return this.model.buildingWork;
      }

      const project = yield this.constructionProject.getFromCacheOrApi(
        this.model.projectId,
      );

      return project.work?.find(
        (buildingWork) =>
          buildingWork.building.EGID === Number(this.model.buildingId),
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
      this.model.buildingId,
    );
    return building;
  }

  @action
  cancelMerge() {
    this.resetImportQueryParams();
    this.fetchBuildingWork.perform();
  }

  @action
  syncLocalityWithStreet(changeset, streetList) {
    changeset.set(
      "building.buildingEntrance.locality.name.nameLong",
      streetList.locality.name.nameLong,
    );
    changeset.set(
      "building.buildingEntrance.locality.swissZipCode",
      streetList.locality.swissZipCode,
    );
    changeset.set(
      "building.buildingEntrance.locality.swissZipCodeAddOn",
      streetList.locality.swissZipCodeAddOn,
    );
    changeset.set("building.buildingEntrance.street", streetList);
  }

  @dropTask
  *saveBuildingWork() {
    try {
      let EGID = this.buildingWork.building.EGID;
      if (this.hasNoProject) {
        yield this.buildingAPI.update(this.buildingWork.building);
      } else {
        if (this.buildingWork.isNew) {
          const building = yield this.buildingAPI.create(
            this.model.projectId,
            this.buildingWork,
          );
          EGID = building.EGID;
        } else {
          yield this.buildingAPI.update(this.buildingWork.building);
          // Only modify work if of type Umbau (only possible there)
          if (this.buildingWork.kindOfWork === 6002) {
            yield this.constructionProject.modifyWork(
              this.model.projectId,
              this.buildingWork,
            );
          }
        }

        // refresh work list
        const project = yield this.constructionProject.get(
          this.model.projectId,
        );

        // remove default work
        // Since all works have per default a new building model,
        // we can figure out the default work by filtering `building.isNew`.
        yield Promise.all(
          project.work.map((work) =>
            work.building.isNew
              ? this.constructionProject.removeWorkFromProject(
                  this.model.projectId,
                  work.ARBID,
                )
              : work,
          ),
        );

        // Clear cache so after transition we fetch the project form api
        this.constructionProject.clearCache(this.model.projectId);
      }

      this.resetImportQueryParams();

      this.buildingAPI.clearCache(this.model.buildingId);
      this.errors = [];
      this.router.transitionTo("building.edit.form", EGID);
      this.notification.success(this.intl.t("ember-gwr.building.saveSuccess"));
    } catch (error) {
      this.errors = error;
      console.error(error);
      this.notification.danger(this.intl.t("ember-gwr.building.saveError"));
    }
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
        this.buildingWork,
      );

      // execute transition(s)
      // cascade level:
      // 2: execute transition on linked dwellings
      // 1: only perform transition on building
      yield this.buildingAPI[transition](
        transition,
        isCascading ? 2 : 1,
        false,
        this.buildingWork,
      );

      yield this.buildingAPI.clearCache(this.model.buildingId);
      this.fetchBuilding.perform(); // reload for errors;
      this.notification.success(this.intl.t("ember-gwr.building.saveSuccess"));
    } catch (error) {
      console.error(error);
      this.notification.danger(this.intl.t("ember-gwr.building.saveError"));

      throw error.isLifeCycleError
        ? this.gwr.buildLifeCycleError(error, this.model)
        : error;
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
}
