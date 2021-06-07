import Service, { inject as service } from "@ember/service";
import { assert } from "@ember/debug";
import SearchResult from "ember-ebau-gwr/models/search-result";

/* eslint-disable ember/classic-decorator-no-classic-methods */
export default class GwrService extends Service {
  @service config;
  @service authFetch;
  @service store;
  @service xml;

  _cache = {};

  constructor(...args) {
    super(...args);
    this._setupHandlebarsPartials();
  }

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

  clearCache(ID) {
    if (ID) {
      delete this._cache[ID];
    } else {
      this._cache = {};
    }
  }
}
