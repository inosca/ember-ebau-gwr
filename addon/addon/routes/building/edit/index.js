import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

export default class BuildingEditIndexRoute extends Route {
  @service building;

  model() {
    return this.modelFor("building.edit");
  }
}
