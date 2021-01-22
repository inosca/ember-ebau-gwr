import Controller from "@ember/controller";
import { inject as service } from "@ember/service";
import { task, lastValue } from "ember-concurrency-decorators";
import { action } from "@ember/object";
import { projectStatusOptions } from "ember-ebau-gwr/models/options";
import { tracked } from "@glimmer/tracking";

export default class SearchProjectController extends Controller {
  @service constructionProject;

  @tracked extendedSearch = false;

  projectStatusOptions = projectStatusOptions;

  @lastValue("search") searchResults;
  @task
  *search(query = {}) {
    query.constructionSurveyDept = 134200;
    return yield this.constructionProject.search(query);
  }

  @action
  linkProject(EPROID) {
    localStorage.setItem("EPROID", EPROID);
    this.transitionToRoute("project.index");
  }
}
