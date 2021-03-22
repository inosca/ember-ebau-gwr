import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { task, lastValue } from "ember-concurrency-decorators";
import { tracked } from "@glimmer/tracking";
import {
  languageOptions,
  periodOfConstructionOptions,
} from "ember-ebau-gwr/models/options";

export default class SearchBuildingController extends Controller {
  @service constructionProject;
  @service config;
  @service intl;
  @service notification;

  @tracked activeBuilding;

  periodOfConstruction = periodOfConstructionOptions;

  @lastValue("search") searchResults;
  @task *search(query) {
    try {
      query.streetLang = languageOptions[this.intl.primaryLocale];
      query.municipality = this.config.municipalityId;
      return yield this.constructionProject.searchBuilding(query);
    } catch (error) {
      console.error(error);
      this.notification.danger("ember-gwr.searchBuilding.searchError");
    }
  }

  @task *linkBuilding(EGID, buildingWork) {
    try {
      yield this.constructionProject.bindBuildingToConstructionProject(
        this.model,
        EGID,
        buildingWork
      );
      this.activeBuilding = null;
      this.transitionToRoute("project.linked-buildings", this.model);
      this.notification.success(
        this.intl.t("ember-gwr.searchBuilding.linkSuccess")
      );
    } catch (error) {
      console.error(error);
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
