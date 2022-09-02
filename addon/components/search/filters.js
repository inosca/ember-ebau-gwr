import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class SearchFiltersComponent extends Component {
  @service intl;

  @tracked extendedSearchActive = false;
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

  @action
  updateField(fieldName, value) {
    this.query[fieldName] = value;
  }
}
