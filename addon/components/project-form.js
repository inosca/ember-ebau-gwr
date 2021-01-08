import Component from "@glimmer/component";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";

export default class ProjectFormComponent extends Component {
  @action
  submit(event) {
    event.preventDefault();
    this.args.onSubmit(event);
  }
}
