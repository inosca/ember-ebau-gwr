import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

export default class BuildingEditIndexRoute extends Route {
  @service building;

  beforeModel() {
    // reset the newRecord
    this.building.newRecord = null;
  }

  model() {
    return this.modelFor("building.edit");
  }
}
