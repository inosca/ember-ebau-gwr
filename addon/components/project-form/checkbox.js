import { action } from "@ember/object";
import Component from "@glimmer/component";

export default class ProjectFormCheckboxComponent extends Component {
  @action
  update(event) {
    this.args.update(event.target.checked);
  }
}
