import { action, set } from "@ember/object";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { inject as service } from "@ember/service";

export default class SearchFiltersComponent extends Component {
  @service intl;

  @tracked extendedSearch = false;
  @tracked validationErrors = {};

  constructor(owner, args) {
    super(owner, args);
    this.query = args.baseQuery ?? {
      realestateIdentification: {},
      createDate: {},
      modifyDate: {},
    };
  }

  @action
  updateField(fieldName, value) {
    set(this.query, fieldName, value);
  }

  @action
  submit(event) {
    event.preventDefault();
    // If the validation returns no error then we can emit the search event.
    if (!(this.extendedSearch && this.validateSearchQuery(this.query))) {
      this.args.search(this.query);
    }
  }

  // This is ugly state modifying code with side effects. But i didnt know a nicer way.
  validateSearchQuery({ realestateIdentification, modifyDate, createDate }) {
    this.validationErrors = {};
    // Since the api needs a number for the realestateIdentification
    // We have to check that the number is set.
    if (
      (realestateIdentification.EGRID ||
        realestateIdentification.numberSuffix ||
        realestateIdentification.subDistrict ||
        realestateIdentification.lot) &&
      !realestateIdentification.number
    ) {
      this.validationErrors.realestateIdentification = this.intl.t(
        "ember-gwr.searchProject.validation.realestateIdentification"
      );
    }

    // If setting a date filter, both the to and from date have to be set.
    if (
      (modifyDate.dateTo || modifyDate.dateFrom) &&
      !(modifyDate.dateTo && modifyDate.dateFrom)
    ) {
      this.validationErrors.modifyDate = this.intl.t(
        "ember-gwr.searchProject.validation.bothDatesSet"
      );
    }

    if (
      (createDate.dateTo || createDate.dateFrom) &&
      !(createDate.dateTo && createDate.dateFrom)
    ) {
      this.validationErrors.createDate = this.intl.t(
        "ember-gwr.searchProject.validation.bothDatesSet"
      );
    }
    // Return a boolean if there are errors or not
    return Object.keys(this.validationErrors).length;
  }
}
