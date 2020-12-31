import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

export default class ProjectLinkExistingRoute extends Route {
  @service constructionProject;
  async beforeModel() {
    const EPROID = 193052735;
    localStorage.setItem("EPROID", EPROID);
    location.replace("/");
  }
}
