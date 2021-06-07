import BuildingEntrance from "ember-ebau-gwr/models/building-entrance";

import GwrService from "./gwr";

export default class BuildingEntranceService extends GwrService {
  createAndCache(xml) {
    const buildingEntrance = new BuildingEntrance(xml);
    this._cache[buildingEntrance.EGAID] = buildingEntrance;
    return buildingEntrance;
  }

  async update(buildingEntrance) {
    const body = this.xml.buildXMLRequest(
      "modifyBuildingEntrance",
      buildingEntrance
    );
    const response = await this.authFetch.fetch(
      `/buildingentrances/${buildingEntrance.EGAID}`,
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
