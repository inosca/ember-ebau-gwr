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

  @tracked page = 0;
  @tracked searchResults = [];
  @tracked noMoreResults = false;

  BuildingSearchValidations = BuildingSearchValidations;

  get periodOfConstructionOptions() {
    return periodOfConstructionOptions.map((option) => ({
      value: option,
      label: this.intl.t(
        `ember-gwr.building.dateOfConstruction.periodOfConstructionOptions.${option}`
      ),
    }));
  }

  // @lastValue("search") searchResults;
  @task *search(_query) {
    this.rawQuery = _query;
    // https://localhost:9090/regbl/api/ech0216/2/buildings?page=0&size=10&sortColumn=geb_egid&sortDirection=asc
    try {
      const query = {
        ...this.rawQuery,
        page: this.page,
        streetLang: this.street.language,
        municipality: this.building.municipality,
      };
      const _results = yield this.building.search(query);
      if (_results.length === 0) {
        this.noMoreResults = true;
      } else {
        this.searchResults = this.searchResults.concat(_results);
      }
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t("ember-gwr.generalErrors.searchError")
      );
    }
  }

  @action loadMore() {
    this.page += 1;
    this.search.perform(this.rawQuery);
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
