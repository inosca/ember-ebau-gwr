import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { Changeset } from "ember-changeset";
import lookupValidator from "ember-changeset-validations";
import { dropTask } from "ember-concurrency";

export default class SearchComponent extends Component {
  @tracked page = 0;
  @tracked searchResults = [];
  @tracked hasMoreResults = false;

  @service notification;
  @service intl;
  @service building;
  @service street;

  constructor(owner, args) {
    super(owner, args);
    this.changeset = new Changeset(
      {},
      lookupValidator(this.args.validations),
      this.args.validations
    );
  }

  @dropTask
  *search(_query) {
    try {
      this.rawQuery = {
        ..._query?.change,
        ...this.rawQuery,
        page: this.page,
        streetLang: this.street.language,
        municipality: this.building.municipality,
      };
      const _results = yield this.args.service.search(this.rawQuery);
      if (!_results || _results.length < 3) {
        // todo: change this to match the page size
        this.hasMoreResults = false;
      } else {
        this.searchResults = this.searchResults.concat(_results);
        this.hasMoreResults = true;
      }
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t("ember-gwr.generalErrors.searchError")
      );
    }
  }

  @dropTask
  *onSubmit(args) {
    this.searchResults = [];
    this.page = 0;
    yield this.search.perform(args);
  }

  @dropTask
  *loadMore() {
    this.page += 1;
    yield this.search.perform();
  }
}
