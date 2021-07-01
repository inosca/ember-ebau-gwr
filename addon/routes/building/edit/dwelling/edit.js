import Route from "@ember/routing/route";

export default class BuildingEditDwellingEditRoute extends Route {
  model({ dwelling_id: dwellingId }) {
    return {
      dwellingId,
      ...this.modelFor("building.edit"),
    };
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.fetchDwelling.perform();
  }
}
