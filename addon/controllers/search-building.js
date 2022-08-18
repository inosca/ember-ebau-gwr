import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { task, dropTask, lastValue } from "ember-concurrency";
import { periodOfConstructionOptions } from "ember-ebau-gwr/models/options";
import BuildingSearchValidations from "ember-ebau-gwr/validations/building-search";

export default class SearchBuildingController extends Controller {
  @service building;
  @service constructionProject;
  @service street;
  @service intl;
  @service notification;
  @service router;

  @tracked activeBuilding;
  @tracked errors;

  BuildingSearchValidations = BuildingSearchValidations;

  @tracked searchModel = {};

  get periodOfConstructionOptions() {
    return periodOfConstructionOptions.map((option) => ({
      value: option,
      label: this.intl.t(
        `ember-gwr.building.dateOfConstruction.periodOfConstructionOptions.${option}`
      ),
    }));
  }

  @lastValue("search") searchResults;
  @task *search() {
    try {
      const query = {
        ...this.searchModel,
        streetLang: this.street.language,
        municipality: this.building.municipality,
      };
      return yield this.building.search(query);
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t("ember-gwr.generalErrors.searchError")
      );
    }
  }

  @dropTask *linkBuilding(EGID, buildingWork) {
    try {
      yield this.building.bindBuildingToConstructionProject(
        this.model,
        EGID,
        buildingWork
      );

      // refresh work list
      const project = yield this.constructionProject.get(this.model);

      // remove default work
      yield Promise.all(
        project.work.map((work) =>
          work.building.isNew
            ? this.constructionProject.removeWorkFromProject(
                this.model,
                work.ARBID
              )
            : work
        )
      );

      this.activeBuilding = null;
      this.router.transitionTo("project.linked-buildings", this.model);
      this.notification.success(
        this.intl.t("ember-gwr.searchBuilding.linkSuccess")
      );
    } catch (error) {
      this.errors = error;
      this.notification.danger(
        this.intl.t("ember-gwr.searchBuilding.linkError")
      );
    }
  }

  @action
  setActiveBuilding(EGID) {
    this.activeBuilding = EGID;
  }
}
