import Route from "@ember/routing/route";

export default class BuildingEditEntranceRoute extends Route {
  model({ entrance_id }) {
    return entrance_id;
  }
}
