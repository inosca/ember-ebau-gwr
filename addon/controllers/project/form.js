import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { task, dropTask, lastValue } from "ember-concurrency-decorators";
import ConstructionProject from "ember-ebau-gwr/models/construction-project";
import Options from "ember-ebau-gwr/models/options";
import ConstructionProjectValidations from "ember-ebau-gwr/validations/construction-project";
import BuildingWork from "ember-ebau-gwr/models/building-work";

export default class ProjectFormController extends Controller {
  queryParams = ["import"];
  ConstructionProjectValidations = ConstructionProjectValidations;
  kindOfWorkOptions = BuildingWork.kindOfWorkOptions;

  @service constructionProject;
  @service building;
  @service dwelling;
  @service config;
  @service dataImport;
  @service store;
  @service router;
  @service intl;
  @service notification;

  @tracked import = false;
  @tracked isOrganisation;
  @tracked buildingWork;
  @tracked typeOfConstructionProject;
  @tracked removedWork = [];
  @tracked errors;

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
    if (this.model.project?.isNew && !this.model.project?.work.length) {
      this.model.project.work = [new BuildingWork()];
    }
    const project = this.model.project?.isNew
      ? this.model.project
      : yield this.constructionProject.getFromCacheOrApi(this.model.projectId);
    this.isOrganisation = project.client.identification.isOrganisation;
    this.buildingWork = project.work.filter((work) => !work.building.isNew);
    this.typeOfConstructionProject = project.typeOfConstructionProject;
    this.errors = [];
    return project;
  }

  @lastValue("fetchCalumaData") importData;
  @task
  *fetchCalumaData() {
    return yield this.dataImport.fetchProject(this.model.instanceId);
  }

  @action
  cancelMerge() {
    this.import = false;
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
        if (this.typeOfConstructionProject === 6010) {
          const added = this.project.work.filter((work) => work.isNew);
          yield Promise.all(
            added.map(async (work) => {
              return await this.constructionProject.addWorkToProject(
                this.model.projectId,
                work
              );
            })
          );
          yield Promise.all(
            this.removedWork.map(async (work) => {
              return await this.constructionProject.removeWorkFromProject(
                this.model.projectId,
                work.ARBID
              );
            })
          );
        }
        yield this.constructionProject.update(this.project);
      }
      this.import = false;
      this.errors = [];
      this.notification.success(
        this.intl.t("ember-gwr.constructionProject.saveSuccess")
      );
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

    console.log("after removal project:", this.project);
  }

  @action
  addWorkLink(buildingWork) {
    console.log("addWorkLink:", buildingWork, this.project);

    this.project.work = [...this.project.work, new BuildingWork()];
    console.log("after add project:", this.project);
  }
}
