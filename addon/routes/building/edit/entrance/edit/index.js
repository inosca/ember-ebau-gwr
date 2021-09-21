import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

export default class BuildingEditEntranceEditIndexRoute extends Route {
  @service buildingEntrance;

  model() {
    // reset the newRecord if building entrance already exists
    // should be done in model hook, beforeModel causes reset of
    // changeset on every route entry (also on new route)
    this.buildingEntrance.newRecord = null;
    return this.modelFor("building.edit.entrance.edit");
  }

  setupController(...args) {
    super.setupController(...args);
    const [controller] = args;
    controller.fetchBuildingEntrance.perform();
  }
}
