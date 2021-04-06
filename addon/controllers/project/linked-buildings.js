import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { task } from "ember-concurrency-decorators";

export default class ProjectLinkedBuildingsController extends Controller {
  @service gwr;

  @task
  *fetchBuildings() {
    try {
      const project = yield this.gwr.getFromCacheOrApi(
        this.model
      );
      return project.work;
    } catch (error) {
      console.error(error);
      this.notification.danger("ember-gwr.linkedBuildings.error");
    }
  }

  @action
  async removeBuildingLink({ building: { EGID } }) {
    try {
      await this.gwr.unbindBuildingFromConstructionProject(
        this.model,
        EGID
      );
      await this.fetchBuildings.perform();
    } catch (error) {
      console.error(error);
      this.notification.danger("ember-gwr.linkedBuildings.removeLinkError");
    }
  }
}
