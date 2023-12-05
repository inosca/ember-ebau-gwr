import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { dropTask, lastValue } from "ember-concurrency";
import { projectStatusOptions } from "ember-ebau-gwr/models/options";
import SearchProjectValidations from "ember-ebau-gwr/validations/search-project";

export default class SearchProjectController extends Controller {
  @service constructionProject;
  @service intl;
  @service store;
  @service router;
  @service notification;
  @service config;

  validations = SearchProjectValidations;

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
        `ember-gwr.searchProject.projectStatusOptions.${option}`,
      ),
    }));
  }

  @lastValue("fetchInstanceLinks") links;
  @dropTask
  *fetchInstanceLinks(projects) {
    if (!projects?.length) return [];

    const links = yield this.store.query("gwr-link", {
      eproid__in: projects.map(({ EPROID }) => EPROID).join(","),
    });

    if (!links.length) return [];

    const instanceLinks = yield this.config.fetchInstanceLinks(
      links.map(({ localId }) => localId),
    );

    return links.map(({ eproid, localId }) => ({
      eproid: Number(eproid),
      ...instanceLinks.find((instanceLink) => instanceLink.localId === localId),
      localLink: `/projects/${eproid}/form`,
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
          this.intl.t("ember-gwr.searchProject.alreadyLinkedInfo"),
        );
      }
    }
    // If accessed from global view, redirect to the edit view
    this.router.transitionTo("project.form", eproid);
  }
}
