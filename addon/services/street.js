import GWRService from "./gwr";
import Street, { StreetList } from "ember-ebau-gwr/models/street";

export default class StreetService extends GWRService {
  cacheKey = "ESID";
  cacheClass = Street;

  async search(query = {}) {
    console.dir(query);
    return super.search(query, query.EGID, {
      xmlMethod: "getStreet",
      urlPath: "streets",
      listModel: StreetList,
      listKey: "street",
      searchKey: "streetWithoutStreetGeometryType",
    });
  }
}
