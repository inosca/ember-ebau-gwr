import Building from "ember-ebau-gwr/models/building";
import BuildingsList from "ember-ebau-gwr/models/buildings-list";

import GwrService from "./gwr";

export default class BuildingService extends GwrService {
  cacheKey = "EGID";
  cacheClass = Building;

  async unbindBuildingFromConstructionProject(EPROID, EGID) {
    const response = await this.authFetch.fetch(
      `/buildings/${EGID}/unbindToConstructionProject/${EPROID}`,
      {
        method: "put",
      }
    );
    if (!response.ok) {
      throw new Error("GWR API: unbindBuildingFromConstructionProject failed");
    }
    // Refresh cache after removing the building
    /* eslint-disable-next-line ember/classic-decorator-no-classic-methods */
    await this.get(EPROID);
  }

  async bindBuildingToConstructionProject(EPROID, EGID, buildingWork) {
    const body = this.xml.buildXMLRequest("bindBuildingToConstructionProject", {
      EPROID,
      EGID,
      buildingWork,
    });
    const response = await this.authFetch.fetch(
      `/buildings/${EGID}/bindToConstructionProject`,
      {
        method: "put",
        body,
      }
    );
    if (!response.ok) {
      throw new Error("GWR API: bindBuildingToConstructionProject failed");
    }
    // Update cache
    /* eslint-disable-next-line ember/classic-decorator-no-classic-methods */
    this.get(EPROID);
  }

  async update(building) {
    const body = this.xml.buildXMLRequest("modifyBuilding", building);
    const response = await this.authFetch.fetch(`/buildings/${building.EGID}`, {
      method: "put",

      body,
    });

    if (!response.ok) {
      throw new Error("GWR API: modifyBuilding failed");
    }

    const xml = await response.text();
    return new Building(xml);
  }

  async create(building) {
    const body = this.xml.buildXMLRequest("addBuilding", building);
    const response = await this.authFetch.fetch("/buildings/", {
      method: "post",
      body,
    });

    if (!response.ok) {
      throw new Error("GWR API: addBuilding failed");
    }

    const xml = await response.text();
    return new Building(xml);
  }

  async get(EGID) {
    if (!EGID) {
      return null;
    }
    const response = await this.authFetch.fetch(`/buildings/${EGID}`);
    const xml = await response.text();
    return this.createAndCache(xml);
  }

  async search(query = {}) {
    return super.search(query, query.EGID, {
      xmlMethod: "getBuilding",
      urlPath: "buildings",
      listModel: BuildingsList,
      listKey: "building",
      searchKey: "buildingsList",
    });
  }
}
