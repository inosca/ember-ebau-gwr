import Route from "@ember/routing/route";

export default class GlobalLandingPageRoute extends Route {
  afterModel({ id } = {}) {
    if (typeof id === "string") {
      this.transitionTo("project");
    }
  }
}
