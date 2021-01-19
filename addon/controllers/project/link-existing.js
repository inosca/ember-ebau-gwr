import Controller from "@ember/controller";
import { inject as service } from "@ember/service";
import { task, lastValue } from "ember-concurrency-decorators";
import { action } from "@ember/object";

export default class ProjectLinkExistingController extends Controller {
  @service constructionProject;

  @lastValue("search") searchResults;
  @task
  *search(query) {
    return yield this.constructionProject.search(query);
  }

  @action
  linkTestProject() {
    const EPROID = 193052735;
    localStorage.setItem("EPROID", EPROID);
    location.replace("/");
  }
}
