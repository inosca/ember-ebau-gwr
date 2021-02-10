import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

export default class ProjectRoute extends Route {
  @service constructionProject;

  async model() {
    const EPROID = localStorage.getItem("EPROID");
    return await this.constructionProject.get(EPROID);
  }

  afterModel(model, transition) {
    if (!model && transition.from?.localName !== "landing-page") {
      this.transitionTo("landing-page");
    }
  }
}
