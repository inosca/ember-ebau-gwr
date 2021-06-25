import { action } from "@ember/object";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class ModelFormDiffComponent extends Component {
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
