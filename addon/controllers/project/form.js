import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { task, dropTask, lastValue } from "ember-concurrency-decorators";
import ImportController from "ember-ebau-gwr/controllers/import";
import BuildingWork from "ember-ebau-gwr/models/building-work";
import ConstructionProject from "ember-ebau-gwr/models/construction-project";
import Options from "ember-ebau-gwr/models/options";
import ConstructionProjectValidations from "ember-ebau-gwr/validations/construction-project";

export default class ProjectFormController extends ImportController {
  importModelName = "project";
  ConstructionProjectValidations = ConstructionProjectValidations;
  kindOfWorkOptions = BuildingWork.kindOfWorkOptions;

  @service constructionProject;
  @service building;
  @service dwelling;
  @service config;
  @service store;
  @service router;
  @service intl;
  @service notification;

  @tracked buildingWork;
  @tracked typeOfConstructionProject;
  @tracked removedWork = [];
  @tracked errors;
  @tracked showConfirmationDialog = false;

  choiceOptions = Options;

  get currentRoute() {
    return this.router.currentRouteName;
  }

  get nextValidStates() {
    const states = this.constructionProject.nextValidStates(
      this.project.projectStatus
    );
    return states;
  }

  @lastValue("fetchProject") project;
  @task
  *fetchProject() {
    yield this.fetchCalumaData.perform();
    // Add a new default work for new projects so we don't have to
    // validate if the user has attached a work or not.
    if (this.model.project?.isNew && !this.model.project?.work.length) {
      this.model.project.work = [new BuildingWork()];
    }
    const project = this.model.project?.isNew
      ? this.model.project
      : yield this.constructionProject.getFromCacheOrApi(this.model.projectId);
    this.buildingWork = project.work.filter((work) => !work.building.isNew);
    this.typeOfConstructionProject = project.typeOfConstructionProject;
    this.errors = [];
    return project;
  }

  @action
  cancelMerge() {
    this.resetImport();
    this.fetchProject.perform();
  }

  @dropTask
  *saveProject() {
    try {
      if (this.project.isNew) {
        const project = yield this.constructionProject.create(this.project);
        const link = this.store.createRecord("gwr-link", {
          eproid: project.EPROID,
          localId: this.model.instanceId,
        });
        yield link.save();
        // Reload the overview table to display the new project
        yield this.constructionProject.all.perform(this.model.instanceId);
        this.transitionToRoute("project.form", project.EPROID);
      } else {
        if (
          (this.typeOfConstructionProject === 6010 &&
            this.workWithBuildings.length) ||
          // If typeOfConstruction === hochbau we only display the alert
          // if we have additional works beside the default work
          (this.typeOfConstructionProject === 6011 &&
            this.workWithoutBuildings.length > 1)
        ) {
          this.showConfirmationDialog = true;
          return;
        }

        if (this.typeOfConstructionProject === 6010) {
          const added = this.project.work.filter((work) => work.isNew);
          yield Promise.all(
            added.map((work) =>
              this.constructionProject.addWorkToProject(
                this.model.projectId,
                work
              )
            )
          );

          yield Promise.all(
            this.removedWork.map((work) =>
              this.constructionProject.removeWorkFromProject(
                this.model.projectId,
                work.ARBID
              )
            )
          );
          this.removedWork = [];
        }
        yield this.constructionProject.update(this.project);
      }

      this.resetImport();
      this.errors = [];
      this.notification.success(
        this.intl.t("ember-gwr.constructionProject.saveSuccess")
      );
      // refresh work list
      this.constructionProject.clearCache(this.model.projectId);
      this.fetchProject.perform();
    } catch (error) {
      this.errors = error;
      this.notification.danger(
        this.intl.t("ember-gwr.constructionProject.saveError")
      );
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
        ConstructionProject.projectTransitionMapping[currentStatus][newStatus];

      // reload in case linked objects have been updated
      const project = yield this.constructionProject.get(this.model.projectId);
      this.project.work = project.work;

      // execute dry-run, throws error if requirements don't hold
      yield this.constructionProject[transition](
        transition,
        3,
        true,
        this.project
      );

      // execute transition(s)
      // cascade level:
      // 3: execute transition on linked buildings and dwellings
      // 1: only perform transition on project
      yield this.constructionProject[transition](
        transition,
        isCascading ? 3 : 1,
        false,
        this.project
      );
      yield this.constructionProject.clearCache(this.model.projectId);
      this.fetchProject.perform(); // reload for errors;
      this.notification.success(
        this.intl.t("ember-gwr.constructionProject.saveSuccess")
      );
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t("ember-gwr.constructionProject.saveError")
      );

      // TODO: make error links compatible with Camac-ng
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
              ? `/${this.model.instanceId}/${this.project.EPROID}/building/${error.buildingId}/dwelling/${error.dwellingId}`
              : `/${this.model.instanceId}/${this.project.EPROID}/building/${error.buildingId}/form`,
            htmlSafe: true,
          }),
        ];
      }

      throw error;
    }
  }

  @action
  getChangeParameters(currentStatus, newStatus) {
    return this.constructionProject.getChangeParameters(
      currentStatus,
      newStatus
    );
  }

  @task
  *correctState(newStatus) {
    try {
      this.constructionProject.correctStatus(this.project, newStatus);
      yield this.constructionProject.update(this.project);
      yield this.constructionProject.clearCache(this.model.projectId);
      this.fetchProject.perform(); // reload for errors;
      this.notification.success(
        this.intl.t("ember-gwr.constructionProject.saveSuccess")
      );
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t("ember-gwr.constructionProject.saveError")
      );
      throw error;
    }
  }
  @action
  getCorrectionParameters(newStatus) {
    return this.constructionProject.getCorrectionParameters(newStatus);
  }

  @action
  getChangeHint(currentStatus, newStatus) {
    return this.constructionProject.getChangeHint(currentStatus, newStatus);
  }

  @action
  updateWork(work, attr, value) {
    work[attr] = value;
  }

  @action
  removeWorkLink(buildingWork) {
    if (!buildingWork.isNew) {
      this.removedWork = [...this.removedWork, buildingWork];
    }

    this.project.work = this.project.work.filter(
      (work) => work !== buildingWork
    );
  }

  @action
  addWorkLink() {
    this.project.work = [...this.project.work, new BuildingWork()];
  }

  @task
  *addDefaultWork() {
    const buildingWork = yield this.constructionProject.addDefaultWork(
      this.project.EPROID
    );
    this.project.work = [...this.project.work, buildingWork];
    return buildingWork;
  }

  @task
  *removeBuildings() {
    return yield Promise.all(
      this.workWithBuildings.map(async (work) => {
        await this.building.unbindBuildingFromConstructionProject(
          this.project.EPROID,
          work.building.EGID
        );
        // locally remove building from work list
        // so that it runs through second save check
        this.project.work = this.project.work.filter((w) => w !== work);
      })
    );
  }

  @task
  *removeWork() {
    // always create default work of type "Neubau" to
    // prevent errors from API, remove all others
    const defaultWork = yield this.addDefaultWork.perform();
    return yield Promise.all(
      this.workWithoutBuildings.map(async (work) => {
        if (work.ARBID !== defaultWork.ARBID) {
          if (!work.isNew) {
            await this.constructionProject.removeWorkFromProject(
              this.project.EPROID,
              work.ARBID
            );
          }
          // locally remove work from work list
          // so that it runs through second save check
          this.project.work = this.project.work.filter((w) => w !== work);
        }
      })
    );
  }

  @task
  *processTypeOfConstructionProjectChange() {
    this.showConfirmationDialog = false;

    if (
      this.typeOfConstructionProject === 6010 &&
      this.workWithBuildings.length
    ) {
      if (!this.workWithoutBuildings.length) {
        yield this.addDefaultWork.perform();
      }
      yield this.removeBuildings.perform();
    } else if (
      this.typeOfConstructionProject === 6011 &&
      this.workWithoutBuildings.length
    ) {
      yield this.removeWork.perform();
    }

    this.saveProject.perform();
  }

  @action
  cancelTypeOfConstructionProjectChange() {
    this.showConfirmationDialog = false;
  }

  get workWithoutBuildings() {
    return this.project.work.filter((work) => work.building.isNew);
  }

  get workWithBuildings() {
    return this.project.work.filter((work) => !work.building.isNew);
  }
}
