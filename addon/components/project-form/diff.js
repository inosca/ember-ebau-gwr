import Component from "@glimmer/component";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";

export default class ProjectFormDiffComponent extends Component {
  @tracked overridenValue;

  get newValue() {
    return this.overridenValue || this.args.new;
  }

  @action
  updateNewValue({ target: { value } = {} } = {}) {
    if (value) {
      this.overridenValue = value;
    }
  }
}
