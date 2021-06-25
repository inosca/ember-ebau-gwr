import Street, { StreetList } from "ember-ebau-gwr/models/street";

import GWRService from "./gwr";

export default class StreetService extends GWRService {
  cacheKey = "ESID";
  cacheClass = Street;

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
