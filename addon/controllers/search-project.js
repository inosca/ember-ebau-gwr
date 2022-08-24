import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { projectStatusOptions } from "ember-ebau-gwr/models/options";

export default class SearchProjectController extends Controller {
  @service constructionProject;
  @service intl;
  @service store;
  @service router;

  get baseModel() {
    return {
      constructionSurveyDeptNumber:
        this.constructionProject.constructionSurveyDeptNumber,
      realestateIdentification: {
        number: null,
      },
    };
  }

  get projectStatusOptions() {
    return projectStatusOptions.map((option) => ({
      value: option,
      label: this.intl.t(
        `ember-gwr.searchProject.projectStatusOptions.${option}`
      ),
    }));
  }

  @action
  selectProject(eproid) {
    if (this.model?.id) {
      const link = this.store.createRecord("gwr-link", {
        eproid,
        localId: this.model.id,
      });
      link.save();
      this.router.transitionTo("project.index");
    }
    // If accessed from global view, redirect to the edit view
    this.router.transitionTo("project.form", eproid);
  }
}
