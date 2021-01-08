import { action } from "@ember/object";
import Component from "@glimmer/component";

export default class ProjectFormComponent extends Component {
  @action
  submit(event) {
    event.preventDefault();
    this.args.onSubmit(event);
  }
}
