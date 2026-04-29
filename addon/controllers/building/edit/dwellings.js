import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { task } from "ember-concurrency";

export default class BuildingEditDwellingsController extends Controller {
  @service building;
  @service dwelling;
  @service intl;
  @service notification;

  @tracked dwellingToRemove;

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
  confirmRemoveDwelling(dwelling) {
    this.dwellingToRemove = dwelling.EWID;
  }

  @action
  async removeDwelling(formValues) {
    try {
      await this.dwelling.deactivate(
        this.model,
        this.dwellingToRemove,
        formValues.get("removeReason"),
      );
      await this.fetchDwellings.perform();
      this.notification.success(
        this.intl.t("ember-gwr.building.dwellings.removeLinkSuccess"),
      );
      // Closes modal on success
      this.dwellingToRemove = null;
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t("ember-gwr.building.dwellings.removeLinkError"),
      );
    }
  }
}
