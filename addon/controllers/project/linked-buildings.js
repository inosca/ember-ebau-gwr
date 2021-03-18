import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { task } from "ember-concurrency-decorators";

export default class ProjectLinkedBuildingsController extends Controller {
  @service constructionProject;

  @task
  *fetchBuildings() {
    const project = yield this.constructionProject.getFromCacheOrApi(
      this.model
    );
    return project.work;
  }

  @action
  async removeBuildingLink({ building: { EGID } }) {
    await this.constructionProject.unbindBuildingFromConstructionProject(
      this.model,
      EGID
    );
    await this.fetchBuildings.perform();
  }
}
