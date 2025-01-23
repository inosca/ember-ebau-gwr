import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";

export default class LinkedProjectsComponent extends Component {
  @service config;
  @service router;
  @service store;
  @service constructionProject;

  @action
  async removeProjectLink() {
    const link = this.store
      .peekAll("gwr-link")
      .find(({ eproid }) => Number(eproid) === this.args.activeProjectId);
    await link.destroyRecord();
    this.router.transitionTo("project.index");
  }
}
