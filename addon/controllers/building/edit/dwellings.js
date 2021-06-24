import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { task } from "ember-concurrency-decorators";

export default class BuildingEditDwellingsController extends Controller {
  @service building;
  @service dwelling;
  @service intl;
  @service notification;

  @task
  *fetchDwellings() {
    try {
      const building = yield this.building.getFromCacheOrApi(this.model);
      return building.buildingEntrance.map((entrance) => {
        entrance.dwelling.buildingEntranceNo = entrance.buildingEntranceNo;
        return entrance.dwelling;
      });
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t("ember-gwr.building.dwellings.error")
      );
    }
  }

  @action
  async removeDwelling() {
    //TODO
  }
}
