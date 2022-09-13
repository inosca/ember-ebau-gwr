import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { projectStatusOptions } from "ember-ebau-gwr/models/options";

export default class SearchProjectController extends Controller {
  @service constructionProject;
  @service intl;
  @service store;
  @service router;
  @service notification;

  get baseQuery() {
    return {
      constructionSurveyDeptNumber:
        this.constructionProject.constructionSurveyDeptNumber,
      sortColumn: this.config.projectSortColumn,
      sortDirection: this.config.projectSortDirection,
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
  async selectProject(eproid) {
    if (this.model?.id) {
      const link = this.store.createRecord("gwr-link", {
        eproid,
        localId: this.model.id,
      });
      try {
        await link.save();
      } catch {
        // Ignore, trying to link project that is already linked.
        // Simply cleanup and redirect to project.
        await link.deleteRecord();
        this.notification.warning(
          this.intl.t("ember-gwr.searchProject.alreadyLinkedInfo")
        );
      }
    }
    // If accessed from global view, redirect to the edit view
    this.router.transitionTo("project.form", eproid);
  }
}
