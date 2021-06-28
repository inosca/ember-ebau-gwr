import { inject as service } from "@ember/service";
import Component from "@glimmer/component";

export default class SubNavComponent extends Component {
  @service router;

  get isHidden() {
    return Array.isArray(this.args.hiddenOnRoute)
      ? this.args.hiddenOnRoute
          .map((route) =>
            this.router.currentRouteName.split(".").includes(route)
          )
          .some(Boolean)
      : this.router.currentRouteName
          .split(".")
          .includes(this.args.hiddenOnRoute);
  }
}
