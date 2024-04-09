import { languageOptions } from "ember-ebau-gwr/models/options";
import Street, { StreetList } from "ember-ebau-gwr/models/street";

import GWRService from "./gwr";

export default class StreetService extends GWRService {
  cacheKey = "ESID";
  cacheClass = Street;
  cachedLanguageOverride;

  async get(ESID) {
    if (!ESID) {
      return null;
    }
    const response = await this.authFetch.fetch(`/streets/${ESID}`);
    const xml = await response.text();
    const street = new Street(xml, "streetWithoutStreetGeometryType");
    return this.cache(street);
  }

  get language() {
    return languageOptions[this.intl.primaryLocale?.split("-")?.[0]];
  }

  async search(query = {}) {
    if (this.cachedLanguageOverride) {
      query.language = this.cachedLanguageOverride;
    }

    const searchResult = await super.search(query, query.EGID, {
      xmlMethod: "getStreet",
      urlPath: "streets",
      listModel: StreetList,
      listKey: "street",
      searchKey: "streetWithoutStreetGeometryType",
    });

    if (!searchResult) {
      let results = [];

      for (const [lang, code] of Object.entries(languageOptions)) {
        query.language = code;

        results.push({
          lang: [lang, code],
          result: super.search(query, query.EGID, {
            xmlMethod: "getStreet",
            urlPath: "streets",
            listModel: StreetList,
            listKey: "street",
            searchKey: "streetWithoutStreetGeometryType",
          }),
        });
      }

      results = await Promise.allSettled(
        results.map(async ({ lang, result }) => {
          return { lang, result: await result };
        }),
      );
      return results
        .filter(({ value }) => value.result?.length)
        .reduce((previous, { value: { lang, result } }) => {
          this.cachedLanguageOverride = lang[1];
          return previous.concat(result);
        }, []);
    }

    return searchResult;
  }
}
