import { inject as service } from "@ember/service";
import Component from "@glimmer/component";

export default class ProjectNavComponent extends Component {
  @service config;
  @service constructionProject;
  @service intl;

  get buildingTabInfoText() {
    if (!this.args.activeProjectId) {
      return this.intl.t(
        "ember-gwr.linkedBuildings.buildingDisabledForNewProject"
      );
    } else if (
      this.constructionProject.getFromCache(this.args.activeProjectId)
        ?.typeOfConstructionProject !== 6011
    ) {
      return this.intl.t(
        "ember-gwr.linkedBuildings.buildingDisabledForInfrastructure"
      );
    }

    return null;
  }
}
