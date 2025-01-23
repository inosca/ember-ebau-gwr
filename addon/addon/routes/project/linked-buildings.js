import Route from "@ember/routing/route";

export default class ProjectLinkedBuildingsRoute extends Route {
  model({ project_id }) {
    return project_id;
  }
}
