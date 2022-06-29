import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { task, lastValue } from "ember-concurrency";
import { projectStatusOptions } from "ember-ebau-gwr/models/options";

export default class SearchProjectController extends Controller {
  @service constructionProject;
  @service intl;
  @service store;
  @service router;

  @tracked extendedSearch = false;
  @tracked validationErrors = {};

  projectStatusOptions = projectStatusOptions;

  @lastValue("search") searchResults;
  @task
  *search(query = {}) {
    query.constructionSurveyDeptNumber =
      this.constructionProject.constructionSurveyDeptNumber;
    return yield this.constructionProject.search(query);
  }

  @action
  selectProject(eproid) {
    if (this.model?.id) {
      const link = this.store.createRecord("gwr-link", {
        eproid,
        localId: this.model.id,
      });
      link.save();
      this.router.transitionTo("project.index");
    }
    // If accessed from global view, redirect to the edit view
    this.router.transitionTo("project.form", eproid);
  }
}
