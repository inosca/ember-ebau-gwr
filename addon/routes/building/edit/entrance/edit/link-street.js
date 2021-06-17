import Route from "@ember/routing/route";

export default class BuildingEditEntranceLinkStreetRoute extends Route {
  model() {
    return this.modelFor("building.edit.entrance.edit");
  }
}
