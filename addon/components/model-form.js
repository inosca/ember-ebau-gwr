import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { dropTask } from "ember-concurrency-decorators";

export default class ModelFormComponent extends Component {
  @service router;
  @service notification;
  @service intl;
  @service config;

  // This array is only used for tracking the still open diffs
  // so we can transition out of the import once the array is empty.
  // All diff state tracking is done in field.js
  @tracked diffs = [];

  get isSaving() {
    return this.submit.isRunning || this.args.onSubmit.isRunning;
  }

  finishImport() {
    this.notification.success(
      this.intl.t("ember-gwr.components.modelForm.diff.resolved")
    );
    this.router.transitionTo({
      queryParams: { import: false, index: undefined },
    });
  }

  @dropTask
  *submit(changeset) {
    yield changeset.validate();
    if (changeset.get("isValid")) {
      yield changeset.save();
      this.args.onSubmit.perform();
    }
  }

  @action
  registerDiff(attr) {
    if (!this.diffs.find((key) => key === attr)) {
      this.diffs.push(attr);
    }
  }

  @action
  resolveDiff(attr) {
    this.diffs = this.diffs.filter((key) => key !== attr);
    if (!this.diffs.length) {
      this.finishImport();
    }
  }

  @action
  importAllData() {
    // We cannot just `Object.assign` here since the child object like `identification` would
    // not be classes with tracked fields etc. anymore but just pojos. We need to preserve the classes.
    const deepMerge = (original, objectToApply) => {
      Object.entries(objectToApply).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          typeof value === "object"
            ? deepMerge(original[key], objectToApply[key])
            : (original[key] = value);
        }
      });
    };
    deepMerge(this.args.model, this.args.importData);
    this.finishImport();
  }

  get showImport() {
    return (
      this.args.hasImport &&
      this.config.importModels.includes(this.args.headerModelName)
    );
  }
}
