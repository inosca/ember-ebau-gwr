import Route from "@ember/routing/route";

export default class ProjectFormRoute extends Route {
  async model({ project_id: projectId }) {
    return {
      projectId,
      instanceId: this.modelFor("application").id,
    };
  }
}
