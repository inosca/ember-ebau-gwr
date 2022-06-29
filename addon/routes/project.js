import Route from "@ember/routing/route";

export default class ProjectRoute extends Route {
  model() {
    return this.modelFor("application")?.id;
  }
}
