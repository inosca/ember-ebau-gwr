import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

export default class GlobalLandingPageRoute extends Route {
  @service router;

  afterModel({ id } = {}) {
    if (typeof id === "string") {
      this.router.transitionTo("project");
    }
  }
}
