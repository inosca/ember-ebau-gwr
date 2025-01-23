import { inject as service } from "@ember/service";
import BuildingEntrance from "ember-ebau-gwr/models/building-entrance";

import GwrService from "./gwr";

export default class BuildingEntranceService extends GwrService {
  BuildingEntrance = BuildingEntrance;

  @service building;

  cacheKey(buildingEntrance) {
    return `${buildingEntrance.EGAID}-${buildingEntrance.EDID}`;
  }
  cacheClass = BuildingEntrance;

  async get(EDID, EGID) {
    if (!EDID && EDID !== 0) {
      return null;
    }
    const response = await this.authFetch.fetch(
      `/buildings/${EGID}/entrance/${EDID}`,
    );
    const xml = await response.text();
    return this.createAndCache(xml);
  }

  async update(buildingEntrance, EGID) {
    buildingEntrance.EGID = EGID;
    const body = this.xml.buildXMLRequest(
      "modifyBuildingEntrance",
      buildingEntrance,
      "Update building entrance",
    );
    const response = await this.authFetch.fetch(
      `/buildings/${EGID}/entrance/${buildingEntrance.EDID}`,
      {
        method: "put",
        body,
      },
    );

    if (!response.ok) {
      const xmlErrors = await response.text();
      const errors = this.extractErrorsFromXML(xmlErrors);

      console.error("GWR API: modifyBuildingEntrance failed");
      throw errors;
    }

    const xml = await response.text();
    return this.createAndCache(xml);
  }

  async create(buildingEntrance, EGID) {
    const body = this.xml.buildXMLRequest(
      "addBuildingEntrance",
      buildingEntrance,
    );
    const response = await this.authFetch.fetch(
      `/buildings/${EGID}/entrance/`,
      {
        method: "post",
        body,
      },
    );

    if (!response.ok) {
      const xmlErrors = await response.text();
      // Throw specific error message for
      // mismatched locality - zip code errors
      const errors = this.extractErrorsFromXML(xmlErrors, [
        {
          errorKey: this.BuildingEntrance.LOCALITY_ERROR,
          errorMessage: this.intl.t(
            "ember-gwr.buildingEntrance.localityError",
            {
              htmlSafe: true,
            },
          ),
        },
      ]);

      console.error("GWR API: addBuildingEntrance failed");
      throw errors;
    }

    // Refresh building cache after adding a entrance

    await this.building.get(EGID);

    const xml = await response.text();
    return this.createAndCache(xml);
  }

  async deactivate(EDID, EGID) {
    const body = this.xml.buildXMLRequest(
      "deactivateBuildingEntrance",
      { EDID, EGID },
      "Deactivate building entrance",
    );
    const response = await this.authFetch.fetch(
      `/buildings/${EGID}/entrance/${EDID}`,
      {
        method: "delete",
        body,
      },
    );
    if (!response.ok) {
      const xmlErrors = await response.text();
      const errors = this.extractErrorsFromXML(xmlErrors);

      console.error("GWR API: deactivateBuildingEntrance failed");
      throw errors;
    }
    // Refresh cache after removing the building

    await this.building.get(EGID);
  }

  async setStreet(EDID, EGID, buildingEntrance) {
    const body = this.xml.buildXMLRequest(
      "modifyBuildingEntrance",
      buildingEntrance,
      "Set street",
    );
    const response = await this.authFetch.fetch(
      `/buildings/${EGID}/entrance/${EDID}`,
      {
        method: "put",
        body,
      },
    );

    if (!response.ok) {
      const xmlErrors = await response.text();
      const errors = this.extractErrorsFromXML(xmlErrors);

      console.error("GWR API: setStreet failed");
      throw errors;
    }

    const xml = await response.text();
    return this.createAndCache(xml);
  }
}
