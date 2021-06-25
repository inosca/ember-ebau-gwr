import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { task } from "ember-concurrency-decorators";

export default class BuildingEntrancesIndexController extends Controller {
  @service building;
  @service buildingEntrance;
  @service intl;
  @service notification;

  @task
  *fetchEntrances() {
    try {
      const building = yield this.building.getFromCacheOrApi(this.model);
      return building.buildingEntrance;
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t("ember-gwr.building.entraces.error")
      );
    }
  }

  @action
  async removeEntranceLink({ EDID }) {
    try {
      await this.buildingEntrance.deactivate(EDID, this.model);
      await this.fetchEntrances.perform();
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t("ember-gwr.linkedBuildings.removeLinkError")
      );
    }
  }
}
