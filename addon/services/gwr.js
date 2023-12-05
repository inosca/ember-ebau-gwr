import { assert } from "@ember/debug";
import Service, { inject as service } from "@ember/service";
import ErrorList from "ember-ebau-gwr/models/error-list";
import SearchResult from "ember-ebau-gwr/models/search-result";
import XMLModel from "ember-ebau-gwr/models/xml-model";

/* eslint-disable ember/classic-decorator-no-classic-methods */
export default class GwrService extends Service {
  @service config;
  @service authFetch;
  @service store;
  @service xml;
  @service intl;

  get pageSize() {
    return this.config.pageSize;
  }

  _cache = {};

  get municipality() {
    return this.authFetch.municipality;
  }

  get constructionSurveyDeptNumber() {
    return this.authFetch.constructionSurveyDeptNumber;
  }

  createAndCache(xml) {
    assert("Must set `cacheKey`", typeof this.cacheKey !== "undefined");
    assert("Must set `cacheClass`", typeof this.cacheClass !== "undefined");
    const model = new this.cacheClass(xml);
    this.cache(model);
    return model;
  }

  cache(model) {
    this._cache[
      typeof this.cacheKey === "function"
        ? this.cacheKey(model)
        : model[this.cacheKey]
    ] = model;
    return model;
  }

  getFromCache(ID) {
    return this._cache[ID];
  }

  async getFromCacheOrApi(...args) {
    return this.getFromCache(...args) || (await this.get(...args));
  }

  clearCache(ID) {
    if (ID) {
      delete this._cache[ID];
    } else {
      this._cache = {};
    }
  }

  async search(
    query,
    id,
    { xmlMethod, urlPath, listModel, listKey, searchKey },
  ) {
    let response;
    if (id) {
      response = await this.authFetch.fetch(`/${urlPath}/${id}`);
      // The api returns a 404 if no results are found for the query
      if (!response.ok && response.status === 404) {
        return [];
      }
      return [new listModel(await response.text(), listKey)];
    }
    // We replace the newlines since they would be encoded in the query param
    // and this would break the xml.

    // https://localhost:9090/regbl/api/ech0216/2/buildings?page=0&size=10&sortColumn=geb_egid&sortDirection=asc
    const queryXML = this.xml
      .buildXMLRequest(xmlMethod, query)
      .replace(/\r?\n|\r/g, "");

    const queryParams = new URLSearchParams({
      ...(query.page !== null && query.page !== undefined
        ? {
            page: query.page,
            size: this.pageSize,
          }
        : {}),
      ...(query.sortColumn
        ? {
            sortColumn: query.sortColumn,
            sortDirection: query.sortDirection,
          }
        : {}),
    }).toString();

    response = await this.authFetch.fetch(
      queryParams ? `/${urlPath}?${queryParams}` : `/${urlPath}`,
      {
        headers: {
          query: queryXML,
        },
      },
    );
    // The api returns a 404 if no results are found for the query
    if (!response.ok && response.status === 404) {
      return [];
    }
    return new SearchResult(await response.text(), {
      [searchKey]: [listModel],
    })[searchKey];
  }

  // (xml: String, errorsToMatch: [{errorKey: String,errorMsg: String}]) => [String]
  extractErrorsFromXML(xml, errorsToMatch = []) {
    const model = new XMLModel(xml);
    model.setFieldsFromXML({
      fields: {
        error: [String],
        errorList: [ErrorList],
      },
    });

    const customErrors =
      model.error?.map(
        (error) =>
          errorsToMatch.find(({ errorKey }) => error === errorKey)
            ?.errorMessage ??
          this.intl.t("ember-gwr.generalErrors.genericFormError"),
      ) ?? [];
    return customErrors.concat(
      model.errorList?.map((error) => error.messageOfError) ?? [],
    );
  }

  concatStates(states) {
    if (states.length === 1) {
      return this.intl.t(`ember-gwr.lifeCycles.states.${states[0]}`);
    }
    const tail = states.pop();
    return `${states
      .map((state) => this.intl.t(`ember-gwr.lifeCycles.states.${state}`))
      .join(", ")} ${this.intl.t("ember-gwr.general.or")} ${this.intl.t(
      `ember-gwr.lifeCycles.states.${tail}`,
    )}`;
  }

  buildLifeCycleError(error, { instanceId, projectId }) {
    const { buildingId, dwellingId, states } = error;
    return {
      linkToRoute: dwellingId
        ? "building.edit.dwelling.edit"
        : "building.edit.form",
      linkToModels: [
        ...(instanceId ? [instanceId] : []),
        buildingId,
        ...(dwellingId ? [dwellingId] : []),
      ],
      linkToText: this.intl.t(
        `ember-gwr.lifeCycles.statusError${
          dwellingId ? "Dwelling" : "Building"
        }`,
        {
          dwellingId,
          buildingId,
        },
      ),
      linkToTextAfter: this.intl.t(`ember-gwr.lifeCycles.statusError`, {
        states: this.concatStates(states),
      }),
      linkToQuery: projectId ? { projectId } : {},
    };
  }

  getChangeHint(cacheClass, currentStatus, newStatus) {
    return cacheClass.transitionHint[currentStatus][newStatus];
  }
}
