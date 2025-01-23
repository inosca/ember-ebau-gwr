import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { task, dropTask, lastValue } from "ember-concurrency";
import ImportController from "ember-ebau-gwr/controllers/import";
import BuildingWork from "ember-ebau-gwr/models/building-work";
import ConstructionProject from "ember-ebau-gwr/models/construction-project";
import Options from "ember-ebau-gwr/models/options";
import ConstructionProjectValidations from "ember-ebau-gwr/validations/construction-project";

export default class ProjectFormController extends ImportController {
  ConstructionProjectValidations = ConstructionProjectValidations;
  kindOfWorkOptions = BuildingWork.kindOfWorkOptions;
  ConstructionProject = ConstructionProject;

  @service constructionProject;
  @service building;
  @service dwelling;
  @service gwr;
  @service config;
  @service store;
  @service router;
  @service intl;
  @service notification;

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
      this.project.projectStatus,
    );
    return states;
  }

  get statusConfiguration() {
    return { correction: true, change: true };
  }

  get hasRemoveWorkLink() {
    return !(this.project.isNew && this.project.work.length === 1);
  }

  get typeOfConstructionProjectHint() {
    switch (this.typeOfConstructionProject) {
      case this.ConstructionProject.INFRASTRUCTURE: {
        return this.intl.t(
          "ember-gwr.linkedBuildings.buildingDisabledForInfrastructure",
        );
      }
      case this.ConstructionProject.SUPERSTRUCTURE: {
        return this.intl.t("ember-gwr.linkedBuildings.superstructureInfo");
      }
      case this.ConstructionProject.SPECIALSTRUCTURE: {
        return this.intl.t("ember-gwr.linkedBuildings.specialstructureInfo");
      }
      default: {
        return "";
      }
    }
  }

  @lastValue("fetchProject") project;
  @task
  *fetchProject() {
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
    this.resetImportQueryParams();
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
        this.router.transitionTo("project.form", project.EPROID);
      } else {
        const added = this.project.work.filter((work) => work.isNew);
        yield Promise.all(
          added.map((work) =>
            this.constructionProject.addWorkToProject(
              this.model.projectId,
              work,
            ),
          ),
        );

        yield Promise.all(
          this.removedWork.map((work) =>
            this.constructionProject.removeWorkFromProject(
              this.model.projectId,
              work.ARBID,
            ),
          ),
        );
        this.removedWork = [];
        yield this.constructionProject.update(this.project);
      }

      this.resetImportQueryParams();
      this.errors = [];
      this.notification.success(
        this.intl.t("ember-gwr.constructionProject.saveSuccess"),
      );
      // refresh work list
      this.constructionProject.clearCache(this.model.projectId);
      this.fetchProject.perform();
    } catch (error) {
      this.errors = error;
      this.notification.danger(
        this.intl.t("ember-gwr.constructionProject.saveError"),
      );
    }
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
        this.project,
      );

      // execute transition(s)
      // cascade level:
      // 3: execute transition on linked buildings and dwellings
      // 1: only perform transition on project
      yield this.constructionProject[transition](
        transition,
        isCascading ? 3 : 1,
        false,
        this.project,
      );
      yield this.constructionProject.clearCache(this.model.projectId);
      this.fetchProject.perform(); // reload for errors;
      this.notification.success(
        this.intl.t("ember-gwr.constructionProject.saveSuccess"),
      );
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t("ember-gwr.constructionProject.saveError"),
      );

      throw error.isLifeCycleError
        ? this.gwr.buildLifeCycleError(error, this.model)
        : error;
    }
  }

  @action
  getChangeParameters(currentStatus, newStatus) {
    return this.constructionProject.getChangeParameters(
      currentStatus,
      newStatus,
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
        this.intl.t("ember-gwr.constructionProject.saveSuccess"),
      );
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t("ember-gwr.constructionProject.saveError"),
      );
      throw error;
    }
  }
  @action
  getCorrectionParameters(newStatus) {
    return this.constructionProject.getCorrectionParameters(newStatus);
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
      (work) => work !== buildingWork,
    );
  }

  @action
  addWorkLink() {
    this.project.work = [...this.project.work, new BuildingWork()];
  }

  @action
  isClientMismatch(changeset) {
    const personNamePath =
      "client.identification.personIdentification.officialName";
    const organisationNamePath =
      "client.identification.organisationIdentification.organisationName";

    const conditionHolds = (isEqual, v, w) => (isEqual ? v === w : v !== w);
    const isMismatch = (value, isEqual, path) =>
      conditionHolds(isEqual, changeset.get("typeOfClient"), value) && changeset
        ? changeset.get(path)
        : false;

    return (
      isMismatch(6161, true, organisationNamePath) ||
      isMismatch(6161, false, personNamePath)
    );
  }
}
