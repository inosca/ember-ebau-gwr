import Route from "@ember/routing/route";

export default class BuildingEditDwellingsRoute extends Route {
  model() {
    return this.modelFor("building.edit").buildingId;
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.fetchDwellings.perform();
  }
}
