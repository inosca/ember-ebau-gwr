import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

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

  get isSubmitDisabled() {
    return !this.hasChanges;
  }

  get hasChanges() {
    return Boolean(
      this.args.changeset.changes.find(({ value }) => value !== "")
    );
  }

  @action
  updateField(fieldName, value) {
    this.query[fieldName] = value;
  }
}
