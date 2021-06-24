import GwrService from "./gwr";
import Dwelling from "ember-ebau-gwr/models/dwelling";
import { inject as service } from "@ember/service";
import { guidFor } from "@ember/object/internals";

export default class DwellingService extends GwrService {
  cacheKey(dwelling) {
    return `${guidFor(dwelling)}-${dwelling.EWID}`;
  }
  cacheClass = Dwelling;

  async get(EWID, EGID) {
    if (!EWID) {
      return null;
    }
    const response = await this.authFetch.fetch(
      `/buildings/${EGID}/dwellings/${EWID}`
    );
    const xml = await response.text();
    return this.createAndCache(xml);
  }
}
