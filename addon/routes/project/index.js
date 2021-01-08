import Route from "@ember/routing/route";
import ConstructionProject from "ember-ebau-gwr/models/construction-project";

export default class ProjectIndexRoute extends Route {
  async model() {
    const project = this.modelFor("project");

    if (!project) {
      return new ConstructionProject();
    }

    return project;
  }
}
