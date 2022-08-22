import { action, set } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
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

  get isSubmitBtnDisabled() {
    return !this.hasChanges;
  }

  get hasChanges() {
    return !!this.args.changeset.changes.find(({ value }) => value !== "");
  }

  @action
  updateField(fieldName, value) {
    set(this.query, fieldName, value);
  }

  @task *submit() {
    if (this.args.changeset.changes.length === 0) {
      this.validationErrors = [this.intl.t("ember-gwr.search.minFilterError")];
      yield;
    } else {
      this.args.search.perform(this.args.changeset.change);
    }
  }
}
