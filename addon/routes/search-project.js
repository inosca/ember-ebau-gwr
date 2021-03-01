import Route from "@ember/routing/route";

export default class SearchProjectRoute extends Route {
  model() {
    return this.modelFor("application");
  }
}
