import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import ConstructionProject from "ember-ebau-gwr/models/construction-project";

export default class ProjectIndexRoute extends Route {
  @service config;

  async model() {
    const project = this.modelFor("project") ?? new ConstructionProject();

    if (project.isNew) {
      project.constructionLocalisation.municipalityId = this.config.municipalityId;
      project.constructionLocalisation.municipalityName = this.config.municipalityName;
      project.constructionLocalisation.cantonAbbreviation = this.config.cantonAbbreviation;
    }

    return project;
  }
}
