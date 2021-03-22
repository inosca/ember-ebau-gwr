import { inject as service } from "@ember/service";
import { task, lastValue } from "ember-concurrency-decorators";
import BuildingsList from "ember-ebau-gwr/models/buildings-list";
import ConstructionProject from "ember-ebau-gwr/models/construction-project";
import ConstructionProjectsList from "ember-ebau-gwr/models/construction-projects-list";
import SearchResult from "ember-ebau-gwr/models/search-result";

import XMLApiService from "./xml-api";

export default class ConstructionProjectService extends XMLApiService {
  @service config;
  @service store;

  cache = {};

  createAndCacheProject(xml) {
    const project = new ConstructionProject(xml);
    this.cache[project.EPROID] = project;
    return project;
  }

  async getToken() {
    const { token } = await fetch(`${this.config.gwrAPI}/tokenWS`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        username: this.config.username,
        password: this.config.password,
        wsk_id: Number(this.config.wsk_id),
      }),
    }).then((response) => response.json());

    return token;
  }

  async get(EPROID) {
    if (!EPROID) {
      return null;
    }
    const response = await fetch(
      `${this.config.gwrAPI}/constructionprojects/${EPROID}`,
      {
        headers: {
          token: await this.getToken(),
        },
      }
    );
    const xml = await response.text();
    return this.createAndCacheProject(xml);
  }

  getFromCache(EPROID) {
    return this.cache[EPROID];
  }

  async getFromCacheOrApi(EPROID) {
    return this.getFromCache(EPROID) || (await this.get(EPROID));
  }

  async update(project) {
    const body = this.buildXMLRequest("modifyConstructionProject", project);
    const response = await fetch(
      `${this.config.gwrAPI}/constructionprojects/${project.EPROID}`,
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
      return this.createAndCacheProject(xml);
    }
    return project;
  }

  async create(project) {
    const body = this.buildXMLRequest("addConstructionProject", project);
    const response = await fetch(
      `${this.config.gwrAPI}/constructionprojects/`,
      {
        method: "post",
        headers: {
          token: await this.getToken(),
        },
        body,
      }
    );
    const xml = await response.text();
    return this.createAndCacheProject(xml);
  }

  searchProject(query) {
    return this.search(
      query,
      query.EPROID,
      "getConstructionProject",
      "constructionprojects",
      ConstructionProjectsList,
      "constructionProject",
      "constructionProjectsList"
    );
  }

  searchBuilding(query) {
    return this.search(
      query,
      query.EGID,
      "getBuilding",
      "buildings",
      BuildingsList,
      "building",
      "buildingsList"
    );
  }

  async search(
    query = {},
    id,
    xmlMethod,
    urlPath,
    listModel,
    listKey,
    searchKey
  ) {
    let response;
    if (id) {
      response = await fetch(`${this.config.gwrAPI}/${urlPath}/${id}`, {
        headers: {
          token: await this.getToken(),
        },
      });
      // The api returns a 404 if no results are found for the query
      if (!response.ok && response.status === 404) {
        return [];
      }
      return [new listModel(await response.text(), listKey)];
    }
    const queryXML = this.buildXMLRequest(xmlMethod, query).replace(
      /\r?\n|\r/g,
      ""
    );
    response = await fetch(`${this.config.gwrAPI}/${urlPath}/`, {
      headers: {
        token: await this.getToken(),
        query: queryXML,
      },
    });
    // The api returns a 404 if no results are found for the query
    if (!response.ok && response.status === 404) {
      return [];
    }
    return new SearchResult(await response.text(), searchKey, listModel)[
      searchKey
    ];
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

  async unbindBuildingFromConstructionProject(EPROID, EGID) {
    await fetch(
      `${this.config.gwrAPI}/buildings/${EGID}/unbindToConstructionProject/${EPROID}`,
      {
        method: "put",
        headers: {
          token: await this.getToken(),
        },
      }
    );
    // Refresh cache after removing the building
    await this.get(EPROID);
  }

  async bindBuildingToConstructionProject(EPROID, EGID, buildingWork) {
    const body = this.buildXMLRequest("bindBuildingToConstructionProject", {
      EPROID,
      EGID,
      ...buildingWork,
    });
    const response = await fetch(
      `${this.config.gwrAPI}/buildings/${EGID}/bindToConstructionProject`,
      {
        method: "put",
        headers: {
          token: await this.getToken(),
        },
        body,
      }
    );
    if (response.ok) {
      // Update cache
      this.get(EPROID);
    }
  }
}
