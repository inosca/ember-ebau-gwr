import Controller from "@ember/controller";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { trackedFunction } from "ember-resources/util/function";

export default class ProjectController extends Controller {
  @service router;
  @service config;
  @service intl;
  @service constructionProject;

  get activeProjectId() {
    return Number(this.router.externalRouter.currentRoute.params.project_id);
  }

  get isLoading() {
    return this.projects.isLoading || this.constructionProject.all.isRunning;
  }

  get displayLandingPage() {
    return (
      !this.projects.value.length &&
      this.router.externalRouter.currentRoute.localName !== "new" &&
      this.router.externalRouter.currentRoute.localName !== "errors"
    );
  }

  @tracked projects = trackedFunction(this, async () => {
    await Promise.resolve();

    if (!this.model) {
      return [
        await this.constructionProject.getFromCacheOrApi(this.activeProjectId),
      ];
    }

    // We then use `gwr.projects` in the template to reference this.
    // This is so we can update the table if we add a new project in the subroute /new
    const projects = await this.constructionProject.all.perform(this.model);

    // Load the first project in the list if none is selected so we always display a project.
    if (this.router.currentRouteName === "project.index") {
      this.router.transitionTo("project.form", projects[0].EPROID);
    }

    return this.constructionProject.projects;
  });
}
