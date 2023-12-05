import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { task } from "ember-concurrency";

export default class BuildingEditDwellingsController extends Controller {
  @service building;
  @service dwelling;
  @service intl;
  @service notification;

  @task
  *fetchDwellings() {
    try {
      const building = yield this.building.getFromCacheOrApi(this.model);
      return building.buildingEntrance.flatMap((entrance) =>
        entrance.dwelling.map((dwelling) => {
          dwelling.buildingEntrance = entrance;
          return dwelling;
        }),
      );
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t("ember-gwr.building.dwellings.error"),
      );
    }
  }

  @action
  async removeDwelling(dwelling) {
    try {
      await this.dwelling.deactivate(this.model, dwelling.EWID);
      await this.fetchDwellings.perform();
      this.notification.success(
        this.intl.t("ember-gwr.building.dwellings.removeLinkSuccess"),
      );
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t("ember-gwr.building.dwellings.removeLinkError"),
      );
    }
  }
}
