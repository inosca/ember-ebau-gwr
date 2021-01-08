import { action } from "@ember/object";
import Component from "@glimmer/component";

export default class ProjectFormSelectComponent extends Component {
  @action
  updateValue(event) {
    this.args.update(event.target.value);
  }
}
