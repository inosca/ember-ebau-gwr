import Route from "@ember/routing/route";

export default class ApplicationRoute extends Route {
  afterModel({ id } = {}) {
    if (typeof id === "string") {
      this.transitionTo("project");
    }
  }
}
