import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { task, lastValue } from "ember-concurrency-decorators";

export default class ProjectController extends Controller {
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
      links.map(({ eproid }) =>
        this.constructionProject.getFromCacheOrApi(eproid)
      )
    );

    // Load the first project in the list if none is selected so we always display a project.
    if (
      !["form", "new"].includes(this.router.currentRoute.localName) &&
      projects.length
    ) {
      this.transitionToRoute("project.form", projects[0].EPROID);
    }

    return projects;
  }

  @action
  async removeProjectLink() {
    const link = this.store
      .peekAll("gwr-link")
      .find(({ eproid }) => eproid === this.activeProject);
    await link.destroyRecord();
    await this.fetchProjects.perform();
  }
}
