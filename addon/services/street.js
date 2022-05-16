import { languageOptions } from "ember-ebau-gwr/models/options";
import Street, { StreetList } from "ember-ebau-gwr/models/street";

import GWRService from "./gwr";

export default class StreetService extends GWRService {
  cacheKey = "ESID";
  cacheClass = Street;

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
    return super.search(query, query.EGID, {
      xmlMethod: "getStreet",
      urlPath: "streets",
      listModel: StreetList,
      listKey: "street",
      searchKey: "streetWithoutStreetGeometryType",
    });
  }
}
