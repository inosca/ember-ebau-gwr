import BuildingEntrance from "ember-ebau-gwr/models/building-entrance";

import GwrService from "./gwr";

export default class BuildingEntranceService extends GwrService {
  cacheKey(buildingEntrance) {
    return `${buildingEntrance.EGAID}-${buildingEntrance.EDID}`;
  }
  cacheClass = BuildingEntrance;

  async get(EDID, EGID) {
    if (!EDID) {
      return null;
    }
    const response = await this.authFetch.fetch(
      `/buildings/${EGID}/entrance/${EDID}`
    );
    const xml = await response.text();
    return this.createAndCache(xml);
  }

  async update(buildingEntrance, EGID) {
    buildingEntrance.EGID = EGID;
    const body = this.xml.buildXMLRequest(
      "modifyBuildingEntrance",
      buildingEntrance,
      "Update building entrance"
    );
    const response = await this.authFetch.fetch(
      `/buildings/${EGID}/entrance/${buildingEntrance.EDID}`,
      {
        method: "put",
        body,
      }
    );

    if (!response.ok) {
      throw new Error("GWR API: modifyBuildingEntrance failed");
    }

    const xml = await response.text();
    return this.createAndCache(xml);
  }
}
