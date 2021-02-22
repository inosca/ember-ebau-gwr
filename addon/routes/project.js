import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

export default class ProjectRoute extends Route {
  @service constructionProject;
  @service store;

  async model() {
    const parentModel = this.modelFor("application");
    const links = await this.store.query("gwr-link", {
      local_id: parentModel.id,
    });
    const eproid = links.get("firstObject.eproid");
    return await this.constructionProject.get(eproid);
  }

  afterModel(model) {
    if (!model) {
      this.transitionTo("landing-page");
    }
  }
}
