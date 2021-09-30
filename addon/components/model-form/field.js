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

  constructor(...args) {
    super(...args);
    this.initializeImport();
  }

  get value() {
    return (
      this.args.value ??
      get(this.args.model, this.args.attr) ??
      // for zero values get returns undefined instead of 0
      this.args.model?.[this.args.attr]
    );
  }

  get importValue() {
    return get(this.args.importData, this.args.attr);
  }

  get showDiff() {
    if (this.args.importData) {
      return (
        !this.diffResolved &&
        this.importValue &&
        this.importValue !== this.value
      );
    }
    return false;
  }

  get disableInput() {
    return this.args.importData && !this.showDiff;
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
    const intlKey =
      this.args.label ?? `${this.args.translationBase}.${this.args.attr}`;
    return (
      this.args.options ??
      this.args.gwrEnumOptions?.map((option) => ({
        value: option,
        label: this.intl.t(`${intlKey}Options.${option}`),
      }))
    );
  }

  @action
  initializeImport() {
    if (this.showDiff) {
      this.args.registerDiff(this.args.attr);
    }
  }

  @action
  updateModelField(eventOrValue) {
    const attr = this.args.attr;
    const value = eventOrValue?.target?.value ?? eventOrValue;

    // If we supply a custom update method use this
    if (this.args.update) {
      this.args.update(attr, value);
    } else {
      this.args.model.set(attr, value);

      if (this.args.importData) {
        this.diffResolved = true;
        this.args.resolveDiff(this.args.attr);
      }
    }
  }
}
