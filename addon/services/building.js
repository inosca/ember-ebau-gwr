import { inject as service } from "@ember/service";
import Building from "ember-ebau-gwr/models/building";
import BuildingsList from "ember-ebau-gwr/models/buildings-list";
import XMLModel from "ember-ebau-gwr/models/xml-model";

import GwrService from "./gwr";

export default class BuildingService extends GwrService {
  @service constructionProject;
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
      const xmlErrors = await response.text();
      const errors = this.extractErrorsFromXML(xmlErrors);

      console.error("GWR API: unbindBuildingFromConstructionProject failed");
      throw errors;
    }
    // Refresh cache after removing the building
    /* eslint-disable-next-line ember/classic-decorator-no-classic-methods */
    await this.constructionProject.get(EPROID);
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
      const xmlErrors = await response.text();
      const errors = this.extractErrorsFromXML(xmlErrors);

      console.error("GWR API: bindBuildingToConstructionProject failed");
      throw errors;
    }
    // Update cache
    /* eslint-disable-next-line ember/classic-decorator-no-classic-methods */
    this.constructionProject.get(EPROID);

    const xml = await response.text();
    return this.createAndCache(xml);
  }

  async update(building) {
    const body = this.xml.buildXMLRequest("modifyBuilding", building);
    const response = await this.authFetch.fetch(`/buildings/${building.EGID}`, {
      method: "put",

      body,
    });

    if (!response.ok) {
      const xmlErrors = await response.text();
      const errors = this.extractErrorsFromXML(xmlErrors);

      console.error("GWR API: modifyBuilding failed");
      throw errors;
    }

    const xml = await response.text();
    return this.createAndCache(xml);
  }

  async create(building) {
    const body = this.xml.buildXMLRequest("addBuilding", building);
    const response = await this.authFetch.fetch("/buildings/", {
      method: "post",
      body,
    });

    if (!response.ok) {
      const xmlErrors = await response.text();
      const errors = this.extractErrorsFromXML(xmlErrors);

      console.error("GWR API: addBuilding failed");
      throw errors;
    }

    const xml = await response.text();
    return this.createAndCache(xml);
  }

  async createAndAddToConstructionProject(EPROID, buildingWork) {
    let body = this.xml.buildXMLRequest("addWorkToProject", buildingWork);
    let response = await this.authFetch.fetch(
      `/constructionprojects/${EPROID}/work`,
      {
        method: "post",
        body,
      }
    );

    if (!response.ok) {
      const xmlErrors = await response.text();
      const errors = this.extractErrorsFromXML(xmlErrors);

      console.error("GWR API: addWorkToProject failed");
      throw errors;
    }

    let xml = await response.text();
    const model = new XMLModel(xml);
    const ARBID = model.getFieldFromXML(
      "ARBID",
      Number,
      "addWorkToProjectResponse"
    );

    body = this.xml.buildXMLRequest(
      "addBuildingToConstructionProject",
      buildingWork.building
    );
    response = await this.authFetch.fetch(
      `/constructionprojects/${EPROID}/work/${ARBID}`,
      {
        method: "post",
        body,
      }
    );

    if (!response.ok) {
      const xmlErrors = await response.text();
      const errors = this.extractErrorsFromXML(xmlErrors);

      console.error("GWR API: addBuildingToConstructionProject failed");
      throw errors;
    }

    xml = await response.text();
    return this.createAndCache(xml);
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

  nextValidStates(state) {
    return Building.buildingStatesMapping[state];
  }

  async transitionState(building, currentStatus, newState) {
    const transition =
      Building.buildingTransitionMapping[currentStatus][newState];
    const body = this.xml.buildXMLRequest(transition, building);

    const response = await this.authFetch.fetch(
      `/buildings/${building.EGID}/${transition}`,
      {
        method: "put",
        body,
      }
    );

    if (!response.ok) {
      const xmlErrors = await response.text();
      const errors = this.extractErrorsFromXML(xmlErrors);

      console.error(`GWR API: ${transition} failed`);
      throw errors;
    }

    const xml = await response.text();
    return this.createAndCache(xml);
  }

  getChangeParameters(currentStatus, newStatus) {
    const transition =
      Building.buildingTransitionMapping[currentStatus][newStatus];

    const parameters = Building.buildingTransitionParameters[transition];
    return parameters;
  }

  getCorrectionParameters(newStatus) {
    return Building.buildingTransitionParametersMapping[newStatus];
  }
}
