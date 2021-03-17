import { inject as service } from "@ember/service";
import { task, lastValue } from "ember-concurrency-decorators";
import ConstructionProject from "ember-ebau-gwr/models/construction-project";
import ConstructionProjectsList from "ember-ebau-gwr/models/construction-projects-list";
import SearchResult from "ember-ebau-gwr/models/search-result";

import XMLApiService from "./xml-api";

export default class BuildingProjectService extends XMLApiService {
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

  async search(query = {}) {
    // if EPROID is set, ignore other search filters
    let response;
    if (query.EPROID) {
      response = await fetch(
        `${this.config.gwrAPI}/constructionprojects/${query.EPROID}`,
        {
          headers: {
            token: await this.getToken(),
          },
        }
      );
      // The api returns a 404 if no results are found for the query
      if (!response.ok && response.status === 404) {
        return [];
      }
      return [
        new ConstructionProjectsList(
          await response.text(),
          "constructionProject"
        ),
      ];
    }
    const queryXML = this.buildXMLRequest(
      "getConstructionProject",
      query
    ).replace(/\r?\n|\r/g, "");
    response = await fetch(`${this.config.gwrAPI}/constructionprojects/`, {
      headers: {
        token: await this.getToken(),
        query: queryXML,
      },
    });
    // The api returns a 404 if no results are found for the query
    if (!response.ok && response.status === 404) {
      return [];
    }

    return new SearchResult(await response.text()).constructionProjectsList;
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
}
