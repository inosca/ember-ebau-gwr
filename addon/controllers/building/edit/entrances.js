import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { task } from "ember-concurrency-decorators";

export default class BuildingEntrancesIndexController extends Controller {
  @service gwr;
  @service intl;
  @service notification;

  @task
  *fetchEntrances() {
    try {
      const building = yield this.gwr.getBuildingFromCacheOrApi(this.model);
      return building.buildingEntrance;
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t("ember-gwr.building.entraces.error")
      );
    }
  }

  @action
  async removeEntranceLink({ building: { EGID } }) {
    try {
      await this.gwr.unbindBuildingFromConstructionProject(this.model, EGID);
      await this.fetchBuildings.perform();
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t("ember-gwr.linkedBuildings.removeLinkError")
      );
    }
  }
}
