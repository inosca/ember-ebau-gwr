import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

export default class BuildingEditEntranceLinkStreetRoute extends Route {
  @service buildingEntrance;
  @service building;

  model() {
    console.log("model link-street");
    return this.modelFor("building.edit.entrance.edit");
  }

  afterModel(model) {
    console.log("aftermodel:", this.building.newRecord);
    if (
      model.entranceId === "new" &&
      !(this.buildingEntrance.newRecord || this.building.newRecord)
    ) {
      this.transitionTo("building.edit.entrance.new");
    }
  }
}
