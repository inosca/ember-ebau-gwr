import Component from "@glimmer/component";
import { inject as service } from "@ember/service";

export default class SubNavComponent extends Component {
  @service router;

  get isHidden() {
    return this.router.currentRouteName
      .split(".")
      .includes(this.args.hiddenOnRoute);
  }
}
