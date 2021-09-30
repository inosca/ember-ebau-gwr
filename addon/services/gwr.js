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

  _cache = {};

  get municipality() {
    return this.authFetch.municipality;
  }

  get constructionSurveyDeptNumber() {
    return `${this.municipality}00`;
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
    query = {},
    id,
    { xmlMethod, urlPath, listModel, listKey, searchKey }
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
    const queryXML = this.xml
      .buildXMLRequest(xmlMethod, query)
      .replace(/\r?\n|\r/g, "");
    response = await this.authFetch.fetch(`/${urlPath}/`, {
      headers: {
        query: queryXML,
      },
    });
    // The api returns a 404 if no results are found for the query
    if (!response.ok && response.status === 404) {
      return [];
    }
    return new SearchResult(await response.text(), {
      [searchKey]: [listModel],
    })[searchKey];
  }

  extractErrorsFromXML(xml, specificError, specificErrorMsg) {
    const model = new XMLModel(xml);
    model.setFieldsFromXML({
      fields: {
        error: [String],
        errorList: [ErrorList],
      },
    });

    const errors = [
      ...(model.error
        ? model.error[0] === specificError
          ? [specificErrorMsg]
          : [this.intl.t("ember-gwr.generalErrors.genericFormError")]
        : []),
      ...(model.errorList
        ? model.errorList.map((error) => error.messageOfError)
        : []),
    ];

    return errors;
  }

  get basePath() {
    const mountPoint = `#/${this.config.mountPoint}`;
    const href = window.location.href;
    return href.includes(mountPoint)
      ? `${href.split(mountPoint, 1)}${mountPoint}`
      : "";
  }

  concatStates(states) {
    if (states.length === 1) {
      return this.intl.t(`ember-gwr.lifeCycles.states.${states[0]}`);
    }
    const tail = states.pop();
    return `${states
      .map((state) => this.intl.t(`ember-gwr.lifeCycles.states.${state}`))
      .join(", ")} ${this.intl.t("ember-gwr.general.or")} ${this.intl.t(
      `ember-gwr.lifeCycles.states.${tail}`
    )}`;
  }

  buildLifeCycleError(error, { instanceId, projectId }) {
    const errorType = error.dwellingId
      ? "statusErrorDwelling"
      : "statusErrorBuilding";
    return [
      this.intl.t(`ember-gwr.lifeCycles.${errorType}`, {
        dwellingId: error.dwellingId,
        buildingId: error.buildingId,
        states: this.concatStates(error.states),
        href: `${this.basePath}/${instanceId}/${projectId}/building/${
          error.buildingId
        }/${error.dwellingId ? `dwelling/${error.dwellingId}` : `form`}`,
        htmlSafe: true,
      }),
    ];
  }
}
