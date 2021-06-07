<<<<<<< HEAD
import { inject as service } from "@ember/service";
import Building from "ember-ebau-gwr/models/building";
import BuildingsList from "ember-ebau-gwr/models/buildings-list";

import GwrService from "./gwr";

export default class BuildingService extends GwrService {
  @service constructionProject;
=======
import GwrService from "./gwr";
import Building from "ember-ebau-gwr/models/building";
import BuildingsList from "ember-ebau-gwr/models/buildings-list";

export default class BuildingService extends GwrService {
>>>>>>> 9a35c74 (refactor(gwr-service): refactor into multiple services for code quality)
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
<<<<<<< HEAD
    await this.constructionProject.get(EPROID);
=======
    await this.get(EPROID);
>>>>>>> 9a35c74 (refactor(gwr-service): refactor into multiple services for code quality)
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
<<<<<<< HEAD
    this.constructionProject.get(EPROID);
=======
    this.get(EPROID);
>>>>>>> 9a35c74 (refactor(gwr-service): refactor into multiple services for code quality)
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
