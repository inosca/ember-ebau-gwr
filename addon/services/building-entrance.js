<<<<<<< HEAD
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
=======
>>>>>>> 9a35c74 (refactor(gwr-service): refactor into multiple services for code quality)
import BuildingEntrance from "ember-ebau-gwr/models/building-entrance";

import GwrService from "./gwr";

export default class BuildingEntranceService extends GwrService {
<<<<<<< HEAD
  @service building;

  @tracked newRecord;

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

  async create(buildingEntrance, EGID) {
    const body = this.xml.buildXMLRequest(
      "addBuildingEntrance",
      buildingEntrance
    );
    const response = await this.authFetch.fetch(
      `/buildings/${EGID}/entrance/`,
      {
        method: "post",
        body,
      }
    );

    if (!response.ok) {
      throw new Error("GWR API: addBuildingEntrance failed");
    }

    this.newRecord = null;
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
=======
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
>>>>>>> 9a35c74 (refactor(gwr-service): refactor into multiple services for code quality)
      {
        method: "put",
        body,
      }
    );

    if (!response.ok) {
<<<<<<< HEAD
      throw new Error("GWR API: setStreet failed");
=======
      throw new Error("GWR API: modifyBuildingEntrance failed");
>>>>>>> 9a35c74 (refactor(gwr-service): refactor into multiple services for code quality)
    }

    const xml = await response.text();
    return this.createAndCache(xml);
  }
}
