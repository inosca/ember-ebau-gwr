import ConstructionProject from "ember-ebau-gwr/models/construction-project";

import XMLApiService from "./xml-api";

export default class BuildingProjectService extends XMLApiService {
  async getToken() {
    // TODO Workaround for nonexistent login for now
    const username = localStorage.getItem("username"),
      password = localStorage.getItem("password"),
      wsk_id = localStorage.getItem("wsk_id");

    if (!username) {
      //eslint-disable-next-line no-alert
      localStorage.setItem("username", prompt("Username:"));
    }
    if (!password) {
      //eslint-disable-next-line no-alert
      localStorage.setItem("password", prompt("Password:"));
    }
    if (!wsk_id) {
      //eslint-disable-next-line no-alert
      localStorage.setItem("wsk_id", prompt("wsk_id:"));
    }

    const { token } = await fetch(
      "http://localhost:8010/proxy/regbl/api/ech0216/2/tokenWS",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          wsk_id: Number(wsk_id),
        }),
      }
    ).then((response) => response.json());

    return token;
  }

  async get(EPROID) {
    if (!EPROID) {
      return null;
    }
    const response = await fetch(
      `http://localhost:8010/proxy/regbl/api/ech0216/2/constructionprojects/${EPROID}`,
      {
        headers: {
          token: await this.getToken(),
        },
      }
    );
    const xml = await response.text();
    return new ConstructionProject(xml);
  }

  async update(project) {
    const body = this.buildXMLRequest("modifyConstructionProject", project);
    const response = await fetch(
      `http://localhost:8010/proxy/regbl/api/ech0216/2/constructionprojects/${project.EPROID}`,
      {
        method: "put",
        headers: {
          token: await this.getToken(),
        },
        body,
      }
    );
    if (response.ok) {
      const xml = await response.text();
      return new ConstructionProject(xml);
    }
    return project;
  }

  async create(project) {
    const body = this.buildXMLRequest("addConstructionProject", project);
    const response = await fetch(
      `http://localhost:8010/proxy/regbl/api/ech0216/2/constructionprojects/`,
      {
        method: "post",
        headers: {
          token: await this.getToken(),
        },
        body,
      }
    );
    const xml = await response.text();
    return new ConstructionProject(xml);
  }

  async search(query = {}) {
    const queryXML = this.buildXMLRequest(
      "getConstructionProject",
      query
    ).replace(/\r?\n|\r/g, "");
    const response = await fetch(
      `http://localhost:8010/proxy/regbl/api/ech0216/2/constructionprojects/`,
      {
        headers: {
          token: await this.getToken(),
          query: queryXML,
        },
      }
    );
    const parser = new DOMParser();
    const searchDocument = parser.parseFromString(
      await response.text(),
      "application/xml"
    );

    const projectList = searchDocument
      .querySelectorAll("constructionProject")
      .map((element) => new ConstructionProject(element));
    return projectList;
  }
}
