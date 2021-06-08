import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import ConstructionProject from "ember-ebau-gwr/models/construction-project";

export default class ProjectNewRoute extends Route {
  @service gwr;
  @service config;

  templateName = "project.form";
  controllerName = "project.form";

  async model() {
    const project = new ConstructionProject();
    await this.gwr.authFetch.housingStatToken.lastRunning;
    project.constructionLocalisation.municipalityId = this.gwr.municipality;
    project.constructionLocalisation.cantonAbbreviation = this.config.cantonAbbreviation;
    project.constructionSurveyDeptNumber = this.gwr.constructionSurveyDeptNumber;
    return { project, instanceId: this.modelFor("application").id };
  }
}
