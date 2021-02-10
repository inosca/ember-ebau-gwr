import { action } from "@ember/object";
import Component from "@glimmer/component";

export default class ProjectFormInputComponent extends Component {
  @action
  updateValue(event) {
    this.args.update(event.target.value);
  }
}
