import Route from "@ember/routing/route";
import ConstructionProject from "ember-ebau-gwr/models/construction-project";
import { inject as service } from "@ember/service";

export default class ProjectIndexRoute extends Route {
  @service config;

  async model() {
    let project = this.modelFor("project") ?? new ConstructionProject();

    if (project.isNew) {
      project.constructionLocalisation.municipalityId = this.config.municipalityId;
      project.constructionLocalisation.municipalityName = this.config.municipalityName;
      project.constructionLocalisation.cantonAbbreviation = this.config.cantonAbbreviation;
    }

    return project;
  }
}
