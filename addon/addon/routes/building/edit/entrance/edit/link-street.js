import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

export default class BuildingEditEntranceLinkStreetRoute extends Route {
  @service buildingEntrance;
  @service building;
  @service router;

  model() {
    return this.modelFor("building.edit.entrance.edit");
  }

  afterModel(model) {
    if (model.buildingId === "new") {
      this.router.transitionTo("building.new");
    } else if (model.entranceId === "new" && model.buildingId !== "new") {
      this.router.transitionTo("building.edit.entrance.new");
    }
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    // Reset search results
    controller.search.last = null;
  }
}
