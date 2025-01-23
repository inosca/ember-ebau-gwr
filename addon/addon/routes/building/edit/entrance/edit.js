import Route from "@ember/routing/route";

export default class BuildingEditEntranceEditRoute extends Route {
  model({ entrance_id: entranceId }) {
    return {
      entranceId,
      ...this.modelFor("building.edit"),
    };
  }
}
