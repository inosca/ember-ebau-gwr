import Helper from "@ember/component/helper";
import { inject as service } from "@ember/service";

export default class extends Helper {
  @service router;

  compute(routes) {
    return routes
      .flat()
      .map((route) => {
        return this.router.currentRouteName.split(".").includes(route);
      })
      .some(Boolean);
  }
}
