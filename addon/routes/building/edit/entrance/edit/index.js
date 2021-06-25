import Route from "@ember/routing/route";

export default class BuildingEditEntranceEditIndexRoute extends Route {
  model() {
    return this.modelFor("building.edit.entrance.edit");
  }

  setupController(...args) {
    super.setupController(...args);
    const [controller] = args;
    controller.fetchBuildingEntrance.perform();
  }
}
