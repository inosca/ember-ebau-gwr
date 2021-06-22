import { get, action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export const converstionTypeMapping = {
  number: Number,
  string: String,
  boolean: Boolean,
};

export default class ModelFormFieldComponent extends Component {
  @service intl;
  @tracked diffResolved = false;

  get showDiff() {
    if (this.args.importData) {
      const currentData = get(this.args.model, this.args.attr);
      const newData = get(this.args.importData, this.args.attr);
      return !this.diffResolved && newData && newData !== currentData;
    }
    return false;
  }

  get disableInput() {
    return this.args.importData && !this.showDiff;
  }

  @action
  updateModelField(attr, eventOrValue) {
    let value = eventOrValue?.target?.value ?? eventOrValue;

    if (this.args.convertValueTo) {
      const convertedValue =
        converstionTypeMapping[this.args.convertValueTo]?.(value) ?? value;
      value =
        Number.isNaN(convertedValue) &&
        (this.args.type === "select" || this.args.inputType === "select")
          ? undefined
          : this.args.convertValueTo === "number" && value === ""
          ? undefined
          : convertedValue;
    }

    // If we supply a custom update method use this
    if (this.args.update) {
      this.args.update(attr, value);
    } else {
      this.args.model.set(attr, value);

      if (this.args.importData) {
        this.diffResolved = true;
      }
    }
  }

  get isStep() {
    return (
      (this.args.type === "number" || this.args.inputType === "number") &&
      (this.args.step || this.args.min || this.args.max)
    );
  }

  get isHorizontal() {
    return (
      this.args.type === "checkbox" ||
      this.args.inputType === "checkbox" ||
      this.args.horizontalLayout
    );
  }

  get isDate() {
    return this.args.type === "date" || this.args.inputType === "date";
  }

  get fieldComponent() {
    return this.isStep
      ? "model-form/step"
      : this.isDate
      ? "model-form/date"
      : "validated-input/render";
  }

  get options() {
    return this.args.options?.map((option) => {
      return {
        value: option,
        label: this.intl.t(
          `${this.args.translationBase}.${this.args.attr}Options.${option}`
        ),
      };
    });
  }
}
