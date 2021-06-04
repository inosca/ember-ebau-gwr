import Route from "@ember/routing/route";

export default class BuildingEditEntranceEditRoute extends Route {
  model({ entrace_id: entranceId }) {
    return {
      entranceId,
      buildingId: this.modelFor("building.edit").buildingId,
    };
  }

  setupController(...args) {
    super.setupController(...args);
    const [controller] = args;
    controller.fetchBuildingEntrance.perform();
  }
}
