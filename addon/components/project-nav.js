import { inject as service } from "@ember/service";
import Component from "@glimmer/component";

export default class ProjectNavComponent extends Component {
  @service config;
  @service intl;

  get buildingTabInfoText() {
    if (!this.args.activeProjectId) {
      return this.intl.t(
        "ember-gwr.linkedBuildings.buildingDisabledForNewProject",
      );
    }

    const project = this.args.instanceId
      ? this.args.projects.find(
          (project) => project.EPROID === this.args.activeProjectId,
        )
      : this.args.projects[0];

    return project?.typeOfConstructionProject === 6010
      ? this.intl.t(
          "ember-gwr.linkedBuildings.buildingDisabledForInfrastructure",
        )
      : null;
  }
}
