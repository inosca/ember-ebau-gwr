import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

export default class BuildingEditEntranceLinkStreetRoute extends Route {
  @service buildingEntrance;

  model() {
    return this.modelFor("building.edit.entrance.edit");
  }

  afterModel(model) {
    if (model.entranceId === "new" && !this.buildingEntrance.newRecord) {
      this.transitionTo("building.edit.entrance.new");
    }
  }
}
