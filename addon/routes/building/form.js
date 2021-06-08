import Route from "@ember/routing/route";

export default class BuildingFormRoute extends Route {
  model({ building_id: buildingId }) {
    return { buildingId, projectId: this.modelFor("building") };
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.fetchBuilding.perform();
  }
}
