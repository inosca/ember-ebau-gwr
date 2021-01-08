import Route from "@ember/routing/route";
import { Project } from "ember-ebau-gwr/models";

export default class ProjectRoute extends Route {
  async model() {
    const project = await JSON.parse(localStorage.getItem("project"));
    return (
      project &&
      new Project({
        ...project,
        eprodid: 12,
        officialConstructionProjectFileNo: 202001,
        extensionOfOfficialConstructionProjectFileNo: 1,
      })
    );
  }

  afterModel(model, transition) {
    if (!model && transition.from?.localName !== "landing-page") {
      this.transitionTo("landing-page");
    }
  }
}
