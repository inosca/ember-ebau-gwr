import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

export default class BuildingEditEntranceLinkStreetRoute extends Route {
  @service buildingEntrance;
  @service building;

  model() {
    return this.modelFor("building.edit.entrance.edit");
  }

  afterModel(model) {
    if (model.buildingId === "new" && !this.building.newRecord) {
      this.transitionTo("building.new");
    } else if (
      model.entranceId === "new" &&
      model.buildingId !== "new" &&
      !this.buildingEntrance.newRecord
    ) {
      this.transitionTo("building.edit.entrance.new");
    }
  }
}
