import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { task } from "ember-concurrency";

export default class ProjectLinkedBuildingsController extends Controller {
  @service constructionProject;
  @service building;
  @service intl;
  @service notification;

  @tracked workWithBuildings;
  @tracked workWithoutBuildings;
  @tracked project;

  @task
  *fetchBuildings() {
    try {
      const project = yield this.constructionProject.getFromCacheOrApi(
        this.model,
      );
      this.project = project;
      this.workWithoutBuildings = project.work.filter(
        (work) => work.building.isNew,
      );
      this.workWithBuildings = project.work.filter(
        (work) => !work.building.isNew,
      );
      return this.workWithBuildings;
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
        EGID,
      );
      await this.fetchBuildings.perform();
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t("ember-gwr.linkedBuildings.removeLinkError"),
      );
    }
  }
}
