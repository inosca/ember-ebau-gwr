import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { dropTask } from "ember-concurrency";
import ImportResource, { NO_DATA_ERROR } from "ember-ebau-gwr/resources/import";
import { isIsoDate } from "ember-ebau-gwr/utils";

export default class ModelFormComponent extends Component {
  @service router;
  @service notification;
  @service intl;
  @service config;

  // This array is only used for tracking the still open diffs
  // so we can transition out of the import once the array is empty.
  // All diff state tracking is done in field.js
  @tracked diffs = [];
  @tracked invalidSubmit = false;

  import = ImportResource.from(this, () => ({
    instanceId: this.args.instanceId,
    showImport: this.args.showImport,
    importModelName: this.args.importModelName ?? this.args.modelName,
  }));

  get importData() {
    const index = parseInt(this.args.importIndex);
    const data =
      Array.isArray(this.import.value) && !isNaN(index)
        ? this.import.value[index]
        : this.import.value;

    return data
      ? {
          index,
          data,
          originalData: this.import.value,
        }
      : null;
  }

  // These getters are a bit funky so they only access the `import`
  // prop (and trigger the resource) if they need to.
  get showImport() {
    return Boolean(this.args.instanceId && this.args.showImport);
  }

  get noImportData() {
    return this.import.error === NO_DATA_ERROR;
  }

  get isSaving() {
    return this.submit.isRunning || this.args.onSubmit.isRunning;
  }

  get modelHasImport() {
    return (
      this.args.instanceId &&
      this.config.importModels.includes(this.args.modelName)
    );
  }

  finishImport() {
    this.notification.success(
      this.intl.t("ember-gwr.components.modelForm.diff.resolved"),
    );
    this.router.externalRouter.transitionTo({
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

    // TODO: How should we handle the status field, if this is in the imported data this will get
    // set here...
    const deepMerge = (original, objectToApply) => {
      Object.entries(objectToApply).forEach(([key, value]) => {
        if (
          original !== null &&
          original !== undefined &&
          value !== null &&
          value !== undefined
        ) {
          typeof value === "object"
            ? deepMerge(original[key], objectToApply[key])
            : isIsoDate(value) // Date casts necessary for import
              ? (original[key] = new Date(value))
              : (original[key] = value);
        }
      });
    };
    deepMerge(this.args.model, this.importData.data);
    this.finishImport();
  }
}
