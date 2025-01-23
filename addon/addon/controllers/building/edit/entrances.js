import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { lastValue, task } from "ember-concurrency";
import BuildingEntrance from "ember-ebau-gwr/models/building-entrance";

export default class BuildingEntrancesIndexController extends Controller {
  BuildingEntrance = BuildingEntrance;

  @service building;
  @service buildingEntrance;
  @service intl;
  @service notification;

  @lastValue("fetchEntrances") entrances;
  @task
  *fetchEntrances() {
    try {
      const building = yield this.building.getFromCacheOrApi(this.model);
      return building.buildingEntrance;
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t("ember-gwr.building.entrances.error"),
      );
    }
  }

  @action
  async removeEntranceLink({ EDID }) {
    try {
      await this.buildingEntrance.deactivate(EDID, this.model);
      await this.fetchEntrances.perform();
      this.notification.success(
        this.intl.t("ember-gwr.building.entrances.removeLinkSuccess"),
      );
    } catch (error) {
      console.error(error);
      // Check if error occurred due to active dwellings attached to the
      // building entrance. TODO: find a way to check for active dwellings
      // before executing the request
      this.notification.danger(
        this.intl.t(
          `ember-gwr.${
            error[0] === this.BuildingEntrance.DEACTIVATION_ERROR
              ? "building.entrances.attachedDwellingsError"
              : "linkedBuildings.removeLinkError"
          }`,
        ),
      );
    }
  }
}
