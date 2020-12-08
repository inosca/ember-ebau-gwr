import { get, set, action } from "@ember/object";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class ProjectFormFieldComponent extends Component {
  @tracked diffResolved = false;

  get componentName() {
    return `project-form/${this.args.inputType ?? "input"}`;
  }

  get showDiff() {
    if (this.args.importData) {
      const currentData = get(this.args.project, this.args.attr);
      const newData = get(this.args.importData, this.args.attr);
      return !this.diffResolved && newData && newData !== currentData;
    }
    return false;
  }

  get disableInput() {
    return this.args.importData && !this.showDiff;
  }

  @action
  updateProjectField(attr, eventOrValue) {
    const value = eventOrValue?.target?.value ?? eventOrValue;

    console.log("update", attr, value);
    set(this.args.project, attr, value);

    if (this.args.importData) {
      this.diffResolved = true;
    }
  }
}
