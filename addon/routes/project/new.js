import { inject as service } from "@ember/service";
import ConstructionProject from "ember-ebau-gwr/models/construction-project";

import FormRoute from "./form";

export default class ProjectNewRoute extends FormRoute {
  @service constructionProject;
  @service config;

  templateName = "project.form";
  controllerName = "project.form";

  async model() {
    const project = new ConstructionProject();
    await this.constructionProject.authFetch.housingStatToken.lastRunning;
    project.constructionLocalisation.municipalityId =
      this.constructionProject.municipality;
    project.constructionLocalisation.cantonAbbreviation =
      this.config.cantonAbbreviation;
    project.constructionSurveyDeptNumber =
      this.constructionProject.constructionSurveyDeptNumber;
    return { project, instanceId: this.modelFor("application")?.id };
  }
}
