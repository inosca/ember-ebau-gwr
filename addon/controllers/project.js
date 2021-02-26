import Controller from "@ember/controller";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { task, lastValue } from "ember-concurrency-decorators";

export default class ProjectController extends Controller {
  queryParams = ["project"];

  @tracked project;

  @service router;
  @service store;
  @service constructionProject;

  get displayLandingPage() {
    return (
      !this.projects.length && this.router.currentRoute.localName !== "new"
    );
  }

  get activeProject() {
    return Number(this.router.currentRoute.params.project_id);
  }

  @lastValue("fetchProjects") projects = [];

  @task
  *fetchProjects() {
    const links = yield this.store.query("gwr-link", {
      local_id: this.model.id,
    });
    // We make a request for each project here but the probability
    // that there are a lot of linked projects is rather small so this
    // should be okay. Would be a future pain point if this requirement
    // would change.
    const projects = yield Promise.all(
      links.map(({ eproid }) => this.constructionProject.get(eproid))
    );

    // Load the first project in the list if none is selected so we always display a project.
    if (this.router.currentRoute.localName !== "form" && projects.length) {
      this.transitionToRoute("project.form", projects[0].EPROID);
    }

    return projects;
  }
}
