import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { task, dropTask, lastValue } from "ember-concurrency";
import { periodOfConstructionOptions } from "ember-ebau-gwr/models/options";
import SearchBuildingValidations from "ember-ebau-gwr/validations/search-building";

export default class SearchBuildingController extends Controller {
  @service constructionProject;
  @service building;
  @service street;
  @service intl;
  @service notification;
  @service router;
  @service config;

  @tracked activeBuilding;
  @tracked errors;

  queryParams = ["projectId"];
  @tracked projectId = null;

  validations = SearchBuildingValidations;

  get baseQuery() {
    return {
      streetLang: this.street?.language,
      municipality: this.building?.municipality,
      sortColumn: this.config.buildingSortColumn,
      sortDirection: this.config.buildingSortDirection,
    };
  }

  get periodOfConstructionOptions() {
    return periodOfConstructionOptions.map((option) => ({
      value: option,
      label: this.intl.t(
        `ember-gwr.building.dateOfConstruction.periodOfConstructionOptions.${option}`,
      ),
    }));
  }

  @dropTask *linkBuilding(EGID, buildingWork) {
    try {
      yield this.building.bindBuildingToConstructionProject(
        this.model,
        EGID,
        buildingWork,
      );

      // refresh work list
      const project = yield this.constructionProject.get(this.model);

      // remove default work
      yield Promise.all(
        project.work.map((work) =>
          work.building.isNew
            ? this.constructionProject.removeWorkFromProject(
                this.model,
                work.ARBID,
              )
            : work,
        ),
      );

      this.activeBuilding = null;
      this.router.transitionTo("project.linked-buildings", this.model);
      this.notification.success(
        this.intl.t("ember-gwr.searchBuilding.linkSuccess"),
      );
    } catch (error) {
      this.errors = error;
      this.notification.danger(
        this.intl.t("ember-gwr.searchBuilding.linkError"),
      );
    }
  }

  @action
  setActiveBuilding(EGID) {
    this.activeBuilding = EGID;
  }

  @action
  redirectToBuilding(EGID) {
    this.router.transitionTo("building.edit.form", EGID);
  }

  @action
  isCurrentlySelectedBuilding(building) {
    return building.EGID === this.loadBuildingPreview.lastRunning.args[0]?.EGID;
  }

  @lastValue("loadBuildingPreview") previewBuilding;
  @task
  *loadBuildingPreview(building, event) {
    try {
      // Stop jump to top of page because of empty href tag
      event.preventDefault();
      return yield this.building.get(building.EGID);
    } catch (error) {
      this.errors = error;
      this.notification.danger(
        this.intl.t("ember-gwr.searchBuilding.previewBuildingError"),
      );
    }
  }
}
