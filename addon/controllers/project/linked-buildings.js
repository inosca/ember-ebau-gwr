import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { task } from "ember-concurrency-decorators";

export default class ProjectLinkedBuildingsController extends Controller {
  @service constructionProject;
  @service building;
  @service intl;
  @service notification;

  @task
  *fetchBuildings() {
    try {
      const project = yield this.constructionProject.getFromCacheOrApi(
        this.model
      );
      return project.work;
    } catch (error) {
      console.error(error);
      this.notification.danger(this.intl.t("ember-gwr.linkedBuildings.error"));
    }
  }

  @action
  async removeBuildingLink({ building: { EGID } }) {
    try {
      await this.building.unbindBuildingFromConstructionProject(
        this.model,
        EGID
      );
      await this.fetchBuildings.perform();
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t("ember-gwr.linkedBuildings.removeLinkError")
      );
    }
  }
}
