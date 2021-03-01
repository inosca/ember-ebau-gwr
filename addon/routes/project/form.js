import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

export default class ProjectFormRoute extends Route {
  @service constructionProject;

  async model({ project_id: projectId }) {
    return {
      projectId,
      instanceId: this.modelFor("application"),
    };
  }
}
