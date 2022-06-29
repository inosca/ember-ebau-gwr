import Route from "@ember/routing/route";

export default class ProjectFormRoute extends Route {
  model({ project_id: projectId }) {
    return {
      projectId,
      instanceId: this.modelFor("application")?.id,
    };
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.fetchProject.perform();
  }
}
