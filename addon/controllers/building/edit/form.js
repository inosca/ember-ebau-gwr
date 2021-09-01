import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { task, dropTask, lastValue } from "ember-concurrency-decorators";
import Models from "ember-ebau-gwr/models";
import BuildingWorkValidations from "ember-ebau-gwr/validations/building-work";

export default class BuildingFormController extends Controller {
  Models = Models;
  BuildingWorkValidations = BuildingWorkValidations;

  @service constructionProject;
  @service("building") buildingAPI;
  @service dwelling;
  @service intl;
  @service notification;

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

  @dropTask
  *saveBuildingWork() {
    try {
      let EGID = this.buildingWork.building.EGID;
      if (this.buildingWork.isNew) {
        let building;
        building = yield this.buildingAPI.create(
          this.model.projectId,
          this.buildingWork
        );
        EGID = building.EGID;
      } else {
        yield this.buildingAPI.update(this.buildingWork.building);
      }
      yield this.buildingAPI.bindBuildingToConstructionProject(
        this.model.projectId,
        EGID,
        this.buildingWork
      );

      const project = yield this.constructionProject.getFromCacheOrApi(
        this.model.projectId
      );

      console.log("project.work", project.work);
      if (project.work.find((work) => work.ARBID === 1)) {
        yield this.constructionProject.deactivateDefaultWork(
          this.model.projectId
        );
      }

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

  // TODO: reduce code duplication and somehow combine check and cascade
  async check(currentStatus, newStatus) {
    if (newStatus === 1007 && this.buildingWork.kindOfWork === 6007) {
      const dwellings = await Promise.all(
        this.building.buildingEntrance
          .map((entrance) => entrance.dwelling)
          .flat()
          .map(async (dwelling) => {
            return await this.dwelling.getFromCacheOrApi(
              dwelling.EWID,
              this.model.buildingId
            );
          })
      );

      if (
        dwellings.some(
          (dwellingUsage) => dwellingUsage.dwelling.dwellingStatus !== 3007
        )
      ) {
        return [
          "Verknüpfte Wohnungen müssen abgebrochen werden bevor das Gebäude abgebrochen werden kann.",
        ];
      }
    } else if (newStatus === 1008) {
      const dwellings = await Promise.all(
        this.building.buildingEntrance
          .map((entrance) => entrance.dwelling)
          .flat()
          .map(async (dwelling) => {
            return await this.dwelling.getFromCacheOrApi(
              dwelling.EWID,
              this.model.buildingId
            );
          })
      );

      if (
        dwellings.some(
          (dwellingUsage) => dwellingUsage.dwelling.dwellingStatus !== 3008
        )
      ) {
        return [
          "Verknüpfte Wohnungen müssen auf nicht realisiert gesetzt werden bevor das Gebäude nicht realisiert werden kann.",
        ];
      }
    }

    return [];
  }

  cascadeStates(currentStatus, newStatus) {
    if (newStatus === 1007 && this.buildingWork.kindOfWork === 6007) {
      return {
        dwelling: {
          currentStatus: [3004, 3005],
          newStatus: 3007,
        },
      };
    } else if (newStatus === 1008) {
      return {
        dwelling: {
          currentStatus: [3001, 3002, 3003],
          newStatus: 3008,
        },
      };
    }
    return undefined;
  }

  @task
  *cascadeTransition(cascadeStates) {
    yield Promise.all(
      this.buildingWork.building.buildingEntrance.map(async (entrance) => {
        await Promise.all(
          entrance.dwelling.map(async (dwelling) => {
            if (
              dwelling.dwellingStatus !== cascadeStates.dwelling.newStatus &&
              cascadeStates.dwelling.currentStatus.includes(
                dwelling.dwellingStatus
              )
            ) {
              console.log("settings dwelling:", dwelling);

              if (cascadeStates.dwelling.newStatus === 3007) {
                console.log("this.buidling:", this.building.yearOfDemolition);
                dwelling.dateOfDemolition.year = this.building.yearOfDemolition;
              }
              await this.dwelling.transitionState(
                dwelling,
                dwelling.dwellingStatus,
                cascadeStates.dwelling.newStatus,
                this.buildingWork.building.EGID
              );
            }
          })
        );
      })
    );
    //yield this.buildingAPI.clearCache(this.model.buildingId);
    //yield this.fetchBuilding.perform();
    //console.log("buildingWork new:", this.buildingWork);
  }

  @task
  *transitionState(currentStatus, newStatus) {
    try {
      const cascadeStates = this.cascadeStates(currentStatus, newStatus);
      if (cascadeStates) {
        yield this.cascadeTransition.perform(cascadeStates);
      }

      const errors = yield this.check(currentStatus, newStatus);
      if (errors.length) {
        throw errors;
      }
      console.log("setting project");
      yield this.buildingAPI.transitionState(
        this.building,
        currentStatus,
        newStatus
      );
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
