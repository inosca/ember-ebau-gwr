import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

export default class BuildingEditIndexRoute extends Route {
  @service building;

  model() {
    // reset the newRecord
    console.log("model buidling");
    this.building.newRecord = null;
    return this.modelFor("building.edit");
  }
}
