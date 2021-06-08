import { action } from "@ember/object";
import Component from "@glimmer/component";

export default class ProjectFormComponent extends Component {
  get isSaving() {
    return this.args.onSubmit.isRunning;
  }

  @action
  submit(event) {
    event.preventDefault();
    this.args.onSubmit.perform(event);
  }
}
