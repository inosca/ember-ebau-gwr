import { action, set } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { Changeset } from "ember-changeset";
import lookupValidator from "ember-changeset-validations";
import { task } from "ember-concurrency";

export default class SearchFiltersComponent extends Component {
  @service intl;

  @tracked extendedSearch = false;
  @tracked errorOptions = [
    {
      value: true,
      label: this.intl.t("ember-gwr.search.hasErrorOptions.true"),
    },
    {
      value: false,
      label: this.intl.t("ember-gwr.search.hasErrorOptions.false"),
    },
  ];

  @tracked changeset;

  constructor(owner, args) {
    super(owner, args);
    this.changeset = new Changeset(
      {
        realestateIdentification: {
          EGRID: null,
          subDistrict: null,
        },
        createDate: {
          dateFrom: null,
          dateTo: null,
        },
        modifyDate: {
          dateFrom: null,
          dateTo: null,
        },
        ...this.args?.model,
      },
      lookupValidator(this.args.validations),
      this.args.validations
    );
  }

  get isSubmitBtnDisabled() {
    return !this.hasChanges;
  }

  get hasChanges() {
    return !!this.changeset.changes.find(({ value }) => value !== "");
  }

  @action
  updateField(fieldName, value) {
    set(this.query, fieldName, value);
  }

  @task *submit() {
    debugger;
    if (this.changeset.changes.length === 0) {
      this.validationErrors = [this.intl.t("ember-gwr.search.minFilterError")];
      yield;
    } else {
      this.args.search.perform(this.changeset.change);
    }
  }
}
