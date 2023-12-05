import { action, get } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { isIsoDate } from "ember-ebau-gwr/utils";

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
      // Using get here since `attr` can be a property path.
      get(this.args.model, this.args.attr) ??
      // for zero values get returns undefined instead of 0
      this.args.model?.[this.args.attr]
    );
  }

  get importValue() {
    // Using get here since `attr` can be a property path.
    return get(this.args.importedData?.data, this.args.attr);
  }

  get showDiff() {
    if (this.args.importedData) {
      return (
        !this.diffResolved &&
        this.importValue !== null &&
        this.importValue !== undefined &&
        this.importValue !== this.value
      );
    }
    return false;
  }

  get disableInput() {
    return this.args.importedData && !this.showDiff;
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
    return this.isStep ? "model-form/step" : "validated-input/render";
  }

  get options() {
    const intlKey =
      this.args.label ?? `${this.args.translationBase}.${this.args.attr}`;

    let options =
      this.args.options ??
      this.args.gwrEnumOptions?.map((option) => ({
        value: option,
        label: this.intl.t(`${intlKey}Options.${option}`),
      }));

    const sortBy = this.args.sortBy;
    if (sortBy) {
      options = options.sort((a, b) =>
        a[sortBy].localeCompare(b[sortBy], this.intl.primaryLocale),
      );
    }

    return options;
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
      // Date casts necessary for import
      this.args.model.set(attr, isIsoDate(value) ? new Date(value) : value);

      if (this.args.importedData) {
        this.diffResolved = true;
        this.args.resolveDiff(this.args.attr);
      }
    }
  }
}
