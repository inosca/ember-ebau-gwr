import Route from "@ember/routing/route";
import {
  Project,
  Client,
  RealestateIdentification,
} from "ember-ebau-gwr/models";

export default class ProjectIndexRoute extends Route {
  async model() {
    const project = this.modelFor("project");

    if (!project) {
      return new Project({
        realestateIdentification: new RealestateIdentification(),
        client: new Client(),
      });
    }

    return project;
  }
}
