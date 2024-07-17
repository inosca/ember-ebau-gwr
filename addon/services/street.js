import { inject as service } from "@ember/service";
import { restartableTask, task } from "ember-concurrency";
import Street, { StreetList } from "ember-ebau-gwr/models/street";

import GWRService from "./gwr";

export default class StreetService extends GWRService {
  @service languages;

  cacheKey = "ESID";
  cacheClass = Street;
  cachedLanguageOverrides;

  constructor(...args) {
    super(...args);

    this.resetCachedLanguages();
  }

  async get(ESID) {
    if (!ESID) {
      return null;
    }
    const response = await this.authFetch.fetch(`/streets/${ESID}`);
    const xml = await response.text();
    const street = new Street(xml, "streetWithoutStreetGeometryType");
    return this.cache(street);
  }

  get primaryLanguage() {
    return this.intl.primaryLocale?.split("-")?.[0];
  }

  get language() {
    return this.languages.languageToCode(this.primaryLanguage);
  }

  @task
  *_search(query) {
    return yield super.search(query, query.EGID, {
      xmlMethod: "getStreet",
      urlPath: "streets",
      listModel: StreetList,
      listKey: "street",
      searchKey: "streetWithoutStreetGeometryType",
    });
  }

  resetCachedLanguages() {
    this.cachedLanguageOverrides = new Set([]);
  }

  @restartableTask
  *searchMultiple(query, useCachedLanguagesOnly) {
    let results = [];

    for (const lang of useCachedLanguagesOnly
      ? this.cachedLanguageOverrides
      : this.languages.availableLanguages) {
      const code = this.languages.languageToCode(lang);
      query.language = code;

      results.push({
        lang: [lang, code],
        result: this._search.perform(query, query.EGID, {
          xmlMethod: "getStreet",
          urlPath: "streets",
          listModel: StreetList,
          listKey: "street",
          searchKey: "streetWithoutStreetGeometryType",
        }),
      });
    }

    results = yield Promise.allSettled(
      results.map(async ({ lang, result }) => {
        return { lang, result: await result };
      }),
    );
    return results
      .filter(({ value }) => value.result?.length)
      .reduce((previous, { value: { lang, result } }) => {
        this.cachedLanguageOverrides.add(lang[0]);
        return previous.concat(result);
      }, []);
  }

  async search(query = {}) {
    const lastQueryString =
      this._search.lastPerformed?.args[0]?.description?.descriptionLong.replaceAll(
        "*",
        "",
      ) || "";
    const currentQueryString =
      query.description?.descriptionLong?.replaceAll("*", "") || "";

    // In order to avoid unnecessary requests while typing (and thereby "refining"
    // the search), we continue searching only with the languages for which we
    // previously received results.
    if (lastQueryString && currentQueryString.includes(lastQueryString)) {
      return this.searchMultiple.perform(query, true);
    }
    this.resetCachedLanguages();
    return this.searchMultiple.perform(query);
  }
}
