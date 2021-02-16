import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

export default class LandingPageRoute extends Route {
  @service store;

  model() {
    const parentModel = this.modelFor("application");
    return this.store.query("gwr-link", {
      local_id: parentModel.id,
    });
  }
  afterModel(links) {
    if (links.length > 0) {
      this.transitionTo("project.index");
    }
  }
}
