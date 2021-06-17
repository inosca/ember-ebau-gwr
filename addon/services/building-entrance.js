import { inject as service } from "@ember/service";
import BuildingEntrance from "ember-ebau-gwr/models/building-entrance";

import GwrService from "./gwr";

export default class BuildingEntranceService extends GwrService {
  @service building;

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

  async deactivate(EDID, EGID) {
    const body = this.xml.buildXMLRequest(
      "deactivateBuildingEntrance",
      { EDID, EGID },
      "Deactivate building entrance"
    );
    const response = await this.authFetch.fetch(
      `/buildings/${EGID}/entrance/${EDID}`,
      {
        method: "delete",
        body,
      }
    );
    if (!response.ok) {
      throw new Error("GWR API: deactivateBuildingEntrance failed");
    }
    // Refresh cache after removing the building
    /* eslint-disable-next-line ember/classic-decorator-no-classic-methods */
    await this.building.get(EGID);
  }

  async setStreet(EDID, EGID, EGAID, street) {
    const body = this.xml.buildXMLRequest(
      "setStreet",
      { EGAID, street },
      "Set street"
    );
    const response = await this.authFetch.fetch(
      `/buildings/${EGID}/entrance/${EDID}`,
      {
        method: "put",
        body,
      }
    );

    if (!response.ok) {
      throw new Error("GWR API: setStreet failed");
    }

    const xml = await response.text();
    return this.createAndCache(xml);
  }
}
