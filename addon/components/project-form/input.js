import Component from "@glimmer/component";
import { action } from "@ember/object";

export default class ProjectFormInputComponent extends Component {
  @action
  updateValue(event) {
    this.args.update(event.target.value);
  }
}
