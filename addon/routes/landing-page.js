import Route from "@ember/routing/route";

export default class LandingPageRoute extends Route {
  beforeModel() {
    if (localStorage.getItem("EPROID")) {
      this.transitionTo("project.index");
    }
  }
}
