import Controller from "@ember/controller";
import { registerDestructor } from "@ember/destroyable";
import { inject as service } from "@ember/service";
import { task, lastValue } from "ember-concurrency";
import { Resource } from "ember-modify-based-class-resource";

export default class ProjectController extends Controller {
  @service router;
  @service config;
  @service constructionProject;

  get currentRoute() {
    return this.router.externalRouter.recognize(
      this.router.externalRouter.currentURL,
    );
  }

  get activeProjectId() {
    return Number(this.currentRoute.params.project_id);
  }

  get isLoading() {
    return this.projects.isLoading || this.constructionProject.all.isRunning;
  }

  get displayLandingPage() {
    return (
      !this.projects.value?.length &&
      this.currentRoute.localName !== "new" &&
      this.currentRoute.localName !== "errors"
    );
  }

  projects = ProjectsResource.from(this, () => ({
    model: this.model,
    activeProjectId: this.activeProjectId,
  }));
}

// The `ProjectController.activeProjectId` getter is computed even if
// `ProjectController.router.externalRouter.currentRoute` has changes
// in its query params and `ProjectController.activeProjectId` has not actually
// changed. This could be the case when all import fields are resolved
// and we transition form `?import=true` to `?import=false`.
//
// To prevent a rerender of the whole form (since if `ProjectController.isLoading` is true,
// we render a spinner) the `ProjectsResource.fetchProjects` task is only performed, if the
// `ProjectController.activeProjectId` has actually changed.
export class ProjectsResource extends Resource {
  @service constructionProject;
  @service router;

  _lastActiveProjectId = null;

  constructor(owner) {
    super(owner);

    registerDestructor(this, () => {
      this.fetchProjects.cancelAll({ resetState: true });
    });
  }

  modify(_positional, named) {
    // The task is only performed, if the `activeProjectId` has changed
    // since the last run. String cast is used to catch NaN values, since NaN
    // is not equal to NaN.
    if (String(this._lastActiveProjectId) !== String(named.activeProjectId)) {
      this.fetchProjects.perform(named);
      this._lastActiveProjectId = named.activeProjectId;
    }
  }

  get isLoading() {
    return this.fetchProjects.isRunning;
  }

  @lastValue("fetchProjects") value;
  @task
  *fetchProjects({ model, activeProjectId }) {
    try {
      if (!model) {
        return [
          yield this.constructionProject.getFromCacheOrApi(activeProjectId),
        ];
      }

      // We then use `gwr.projects` in the template to reference this.
      // This is so we can update the table if we add a new project in the subroute /new
      const projects = yield this.constructionProject.all.perform(model);

      // Load the first project in the list if none is selected so we always display a project.
      if (projects.length && this.router.currentRouteName === "project.index") {
        this.router.transitionTo("project.form", projects[0].EPROID);
      }

      return this.constructionProject.projects;
    } catch (error) {
      console.error(error);
    }
  }
}
