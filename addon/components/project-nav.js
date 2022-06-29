import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { trackedFunction } from "ember-resources/util/function";

// QC_TODO check if this works as intended
export default class ProjectNavComponent extends Component {
  @service router;
  @service store;
  @service config;
  @service constructionProject;
  @service intl;

  get displayLandingPage() {
    console.log(this.projects)
    return (
      !this.projects.value?.length &&
      this.router.externalRouter.currentRoute.localName !== "new" &&
      this.router.externalRouter.currentRoute.localName !== "errors"
    );
  }

  get buildingTabInfoText() {
    if (!this.activeProject) {
      return this.intl.t(
        "ember-gwr.linkedBuildings.buildingDisabledForNewProject"
      );
    } else if (
      this.projects.value.find(
        (project) => project.EPROID === this.activeProject
      )?.typeOfConstructionProject !== 6011
    ) {
      return this.intl.t(
        "ember-gwr.linkedBuildings.buildingDisabledForInfrastructure"
      );
    }

    return null;
  }

  get activeProject() {
    return Number(this.router.externalRouter.currentRoute.params.project_id);
  }

  @tracked projects = trackedFunction(this, async () => {
    // https://github.com/NullVoxPopuli/ember-resources/issues/340
    const localName = this.router.externalRouter.currentRoute.localName;
    await Promise.resolve(this.args.caseId);

    // We then use `gwr.projects` in the template to reference this.
    // This is so we can update the table if we add a new project in the subroute /new
    const projects = await this.constructionProject.all.perform(
      this.args.caseId
    );

    // Load the first project in the list if none is selected so we always display a project.
    if (
      !["form", "new", "linked-buildings", "errors"].includes(localName) &&
      projects.length
    ) {
      this.router.transitionTo("project.form", projects[0].EPROID);
    }

    return projects;
  });

  @action
  removeProjectLink() {
    this.constructionProject.removeProjectLink(this.activeProject);
  }
}
