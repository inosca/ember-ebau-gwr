import { next } from "@ember/runloop";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { Changeset } from "ember-changeset";
import lookupValidator from "ember-changeset-validations";
import { dropTask } from "ember-concurrency";
import ExtendedSearchValidations from "ember-ebau-gwr/validations/extended-search-fields";

export default class SearchComponent extends Component {
  @tracked page = 0;
  @tracked searchResults = null;
  @tracked hasMoreResults = false;
  @tracked rawQuery = {};

  @service notification;
  @service intl;
  @service config;

  constructor(owner, args) {
    super(owner, args);

    let validations = {
      ...this.args.validations,
    };
    let baseQuery = {
      ...(this.args.baseQuery ?? {}),
    };

    if (this.args.extendedSearch) {
      validations = {
        ...validations,
        ...ExtendedSearchValidations,
      };
      baseQuery = {
        realestateIdentification: {
          number: null,
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
        ...baseQuery,
      };
    }

    this.changeset = new Changeset(
      baseQuery,
      lookupValidator(validations),
      validations,
    );

    this.rawQuery = baseQuery;
    if (this.args.paginate) {
      next(this, () => {
        this.onSubmit.perform();
      });
    }
  }

  @dropTask
  *search(_query) {
    try {
      this.rawQuery = {
        ...this.rawQuery,
        ..._query?.pendingData,
        ...(this.args.paginate ? { page: this.page } : {}),
      };

      const _results = yield this.args.service.search(this.rawQuery);
      if (
        !this.args.paginate ||
        !_results ||
        _results.length < this.config.pageSize
      ) {
        this.hasMoreResults = false;
      } else {
        this.hasMoreResults = true;
      }

      this.searchResults =
        this.page === 0 ? _results : this.searchResults.concat(_results);

      yield this.args.onSearch?.(this.searchResults);
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t("ember-gwr.generalErrors.searchError"),
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
