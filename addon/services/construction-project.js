import { task, lastValue } from "ember-concurrency-decorators";
import ConstructionProject from "ember-ebau-gwr/models/construction-project";
import BuildingWork from "ember-ebau-gwr/models/building-work";
import XMLModel from "ember-ebau-gwr/models/xml-model";
import ConstructionProjectsList from "ember-ebau-gwr/models/construction-projects-list";

import GwrService from "./gwr";

export default class ConstructionProjectService extends GwrService {
  cacheKey = "EPROID";
  cacheClass = ConstructionProject;

  async get(EPROID) {
    if (!EPROID) {
      return null;
    }
    const response = await this.authFetch.fetch(
      `/constructionprojects/${EPROID}`
    );
    const xml = await response.text();
    return this.createAndCache(xml);
  }

  async update(project) {
    const body = this.xml.buildXMLRequest("modifyConstructionProject", project);
    const response = await this.authFetch.fetch(
      `/constructionprojects/${project.EPROID}`,
      {
        method: "put",

        body,
      }
    );

    if (!response.ok) {
      const xmlErrors = await response.text();
      const errors = this.extractErrorsFromXML(xmlErrors);

      console.error("GWR API: modifyConstructionProject failed");
      throw errors;
    }

    const xml = await response.text();
    return this.createAndCache(xml);
  }

  async create(project) {
    console.log("create");
    const body = this.xml.buildXMLRequest("addConstructionProject", project);
    console.log("body:", body);
    const response = await this.authFetch.fetch("/constructionprojects/", {
      method: "post",
      body,
    });

    if (!response.ok) {
      const xmlErrors = await response.text();
      const errors = this.extractErrorsFromXML(xmlErrors);

      console.error("GWR API: addConstructionProject failed");
      throw errors;
    }

    const xml = await response.text();
    return this.createAndCache(xml);
  }

  async deactivateDefaultWork(projectId) {
    return await this.removeWorkFromProject(projectId, 1);
  }

  async addDefaultWork(projectId) {
    const buildingWork = new BuildingWork();
    buildingWork.kindOfWork = 6002;
    buildingWork.ARBID = 1;
    console.log("buildingWork:", buildingWork);
    return await this.addWorkToProject(projectId, buildingWork);
  }

  async addWorkToProject(projectId, buildingWork) {
    const body = this.xml.buildXMLRequest("addWorkToProject", buildingWork);
    const response = await this.authFetch.fetch(
      `/constructionprojects/${projectId}/work`,
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

    const xml = await response.text();
    const model = new XMLModel(xml);
    const ARBID = model.getFieldFromXML(
      "ARBID",
      Number,
      "addWorkToProjectResponse"
    );

    console.log("ARBID:", ARBID);
    buildingWork.ARBID = ARBID;

    console.log("buildingWork:", buildingWork);
    // TODO: apply for type umbau with modifyWork, don't execute bindBuildingToConstructionProject
    return buildingWork;
    /*return buildingWork.kindOfWork === 6002
      ? await this.modifyWork(projectId, buildingWork)
      : buildingWork;*/
  }

  async modifyWork(projectId, buildingWork) {
    const body = this.xml.buildXMLRequest("modifyWork", buildingWork);
    console.log("body:", body);
    const response = await this.authFetch.fetch(
      `/constructionprojects/${projectId}/work/${buildingWork.ARBID}`,
      {
        method: "put",
        body,
      }
    );

    if (!response.ok) {
      const xmlErrors = await response.text();
      const errors = this.extractErrorsFromXML(xmlErrors);

      console.error("GWR API: modifyWork failed");
      throw errors;
    }

    const xml = await response.text();
    console.log("xml modifyWork:", xml);
    return buildingWork;
  }

  async removeWorkFromProject(projectId, workId) {
    const response = await this.authFetch.fetch(
      `/constructionprojects/${projectId}/work/${workId}`,
      {
        method: "delete",
      }
    );

    if (!response.ok) {
      const xmlErrors = await response.text();
      const errors = this.extractErrorsFromXML(xmlErrors);

      console.error("GWR API: deactivateWork failed");
      throw errors;
    }

    const xml = await response.text();
    return this.createAndCache(xml);
  }

  @lastValue("all") projects = [];
  @task
  *all(localId) {
    const links = yield this.store.query("gwr-link", {
      local_id: localId,
    });
    // We make a request for each project here but the probability
    // that there are a lot of linked projects is rather small so this
    // should be okay. Would be a future pain point if this requirement
    // would change.
    const projects = yield Promise.all(
      links.map(({ eproid }) => this.getFromCacheOrApi(eproid))
    );
    return projects;
  }

  async search(query = {}) {
    return super.search(query, query.EPROID, {
      xmlMethod: "getConstructionProject",
      urlPath: "constructionprojects",
      listModel: ConstructionProjectsList,
      listKey: "constructionProject",
      searchKey: "constructionProjectsList",
    });
  }

  nextValidStates(state) {
    return ConstructionProject.projectStatesMapping[state];
  }

  async transitionState(project, currentStatus, newState) {
    const transition =
      ConstructionProject.projectTransitionMapping[currentStatus][newState];
    const body = this.xml.buildXMLRequest(transition, project);

    const response = await this.authFetch.fetch(
      `/constructionprojects/${project.EPROID}/${transition}`,
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
      ConstructionProject.projectTransitionMapping[currentStatus][newStatus];

    const parameters =
      ConstructionProject.projectTransitionParameters[transition];
    return parameters;
  }

  getCorrectionParameters(newStatus) {
    return ConstructionProject.projectTransitionParametersMapping[newStatus];
  }

  correctStatus(project, newStatus) {
    const necessaryParameters = ConstructionProject.projectTransitionParametersMapping[
      newStatus
    ].map((param) => param.field);
    ConstructionProject.statusParameters.forEach((parameter) => {
      if (project[parameter] && !necessaryParameters.includes(parameter)) {
        project[parameter] = "9999-01-01";
      }
    });
  }

  getChangeHint(currentStatus, newStatus) {
    return ConstructionProject.projectTransitionHint[currentStatus][newStatus];
  }
}
