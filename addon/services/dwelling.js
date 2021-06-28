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

  async update(dwelling, EGID) {
    console.log(dwelling);
    console.dir(dwelling);
    const body = this.xml.buildXMLRequest(
      "modifyDwelling",
      dwelling,
      "Update dwelling"
    );
    const response = await this.authFetch.fetch(
      `/buildings/${EGID}/dwellings/${dwelling.EWID}`,
      {
        method: "put",
        body,
      }
    );

    if (!response.ok) {
      throw new Error("GWR API: modifyDwelling failed");
    }

    const xml = await response.text();
    return this.createAndCache(xml);
  }

  async create(dwelling, EGID) {
    const body = this.xml.buildXMLRequest(
      "addDwelling",
      dwelling,
      "Add dwelling"
    );
    const response = await this.authFetch.fetch(
      `/buildings/${EGID}/entrance/${EDID}/dwellings/work`,
      {
        method: "post",
        body,
      }
    );

    if (!response.ok) {
      throw new Error("GWR API: addDwelling failed");
    }

    const xml = await response.text();
    return this.createAndCache(xml);
  }
}
