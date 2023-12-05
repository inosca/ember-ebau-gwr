import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { Changeset } from "ember-changeset";
import lookupValidator from "ember-changeset-validations";
import { dropTask } from "ember-concurrency";
import { statusValidation } from "ember-ebau-gwr/validations/status";

export default class ModelFormHeaderStatusSelectorComponent extends Component {
  @service intl;

  @tracked errors = [];
  @tracked changeErrors = [];
  @tracked correctionErrors = [];
  @tracked changesetChange;
  @tracked isChange;
  @tracked modelStatus;
  @tracked newStatus;
  @tracked isCascading = false;

  constructor(...args) {
    super(...args);
    const statusValidationsChange = statusValidation(this.args.modelName, true);
    this.changesetChange = new Changeset(
      this.args.model,
      lookupValidator(statusValidationsChange),
      statusValidationsChange,
    );
    const statusValidationsCorrection = statusValidation(
      this.args.modelName,
      false,
    );
    this.changesetCorrection = new Changeset(
      this.args.model,
      lookupValidator(statusValidationsCorrection),
      statusValidationsCorrection,
    );

    this.modelStatus = this.args.model[this.args.modelStatusField];
    this.newStatus = this.modelStatus ?? this.statusOptions[0];
  }

  @action
  statusUpdate(event) {
    event.preventDefault();

    this.resetErrors();
    this.newStatus = parseInt(event.target.value);
    this.isCascading = false;
  }

  get statusOptions() {
    return this.args.modelStatusOptions.map((option) => ({
      status: option,
      label: this.intl.t(
        `ember-gwr.lifeCycles.${this.args.modelName}.statusOptions.${option}`,
      ),
    }));
  }

  get isValidStatusChange() {
    return (
      this.modelStatus && this.args.nextValidStates.includes(this.newStatus)
    );
  }

  @action
  resetErrors() {
    this.changeErrors = [];
    this.errors = [];
    this.correctionErrors = [];
  }

  @dropTask
  *submit(isConfirmation, isChange) {
    this.isChange = isChange;
    this.resetErrors();

    const parameters = isChange
      ? this.changeParameters
      : this.correctionParameters;

    // if parameters are needed, only submit on confirmation
    if (parameters.length && !isConfirmation) {
      return;
    }

    const errorsField = !parameters.length
      ? "errors"
      : isChange
        ? "changeErrors"
        : "correctionErrors";

    const changeset = isChange
      ? this.changesetChange
      : this.changesetCorrection;

    // TODO: should be able to limit keys that dirty changeset
    //const fields = parameters.map((parameter) => parameter.field);
    //changeset = changeset.cast([ ...fields, this.args.modelStatusField ]);

    changeset.set(this.args.modelStatusField, this.newStatus);
    yield changeset.validate();
    if (changeset.isInvalid) {
      this[errorsField] = [
        this.intl.t("ember-gwr.components.modelForm.validationError"),
      ];

      return;
    }

    if (isChange) {
      changeset.rollbackProperty(this.args.modelStatusField);
    }
    yield changeset.save();

    try {
      yield isChange
        ? this.args.onStatusChange.perform(
            this.modelStatus,
            this.newStatus,
            this.isCascading,
          )
        : this.args.onStatusCorrection.perform(this.newStatus);

      this.modelStatus = this.newStatus;
    } catch (error) {
      this[errorsField] = error;
    }
  }

  get changeParameters() {
    return this.modelStatus && this.newStatus
      ? this.args.getChangeParameters(this.modelStatus, this.newStatus)
      : [];
  }

  get correctionParameters() {
    return this.args.getCorrectionParameters(this.newStatus);
  }

  get changeHint() {
    return this.args.getChangeHint && this.modelStatus && this.newStatus
      ? this.args.getChangeHint(this.modelStatus, this.newStatus)
      : undefined;
  }

  @action
  toggleCascading() {
    this.isCascading = !this.isCascading;
  }
}
