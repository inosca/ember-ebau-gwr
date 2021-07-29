import { action } from "@ember/object";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class ModelFormDiffComponent extends Component {
  @tracked overridenValue;

  get newValue() {
    return this.overridenValue || this.args.new;
  }

  @action
  updateNewValue(eventOrValue) {
    const value = eventOrValue?.target?.value ?? eventOrValue;
    if (value) {
      this.overridenValue = value;
    }
  }
}
