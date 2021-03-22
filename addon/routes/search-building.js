import Route from "@ember/routing/route";

export default class SearchBuildingRoute extends Route {
  model({ project_id }) {
    return project_id;
  }
}
