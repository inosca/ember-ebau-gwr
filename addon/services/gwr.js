import Service, { inject as service } from "@ember/service";
import { task, lastValue } from "ember-concurrency-decorators";
import Models from "ember-ebau-gwr/models";
import BuildingsList from "ember-ebau-gwr/models/buildings-list";
import ConstructionProject from "ember-ebau-gwr/models/construction-project";
import ConstructionProjectsList from "ember-ebau-gwr/models/construction-projects-list";
import SearchResult from "ember-ebau-gwr/models/search-result";
import * as Helpers from "ember-ebau-gwr/xml/helpers";
import { Partials, Templates } from "ember-ebau-gwr/xml/templates";
import Handlebars, { compile } from "handlebars";

/* eslint-disable ember/classic-decorator-no-classic-methods */
export default class GwrService extends Service {
  @service config;
  @service authFetch;
  @service store;
  @service authFetch;

  _cache = {};

  constructor(...args) {
    super(...args);
    this._setupHandlebarsPartials();
  }

  get municipality() {
    return this.authFetch.municipality;
  }

  get constructionSurveyDeptNumber() {
    return `${this.municipality}00`;
  }

  createAndCacheProject(xml) {
    const project = new ConstructionProject(xml);
    this._cache[project.EPROID] = project;
    return project;
  }

  async get(EPROID) {
    if (!EPROID) {
      return null;
    }
    const response = await this.authFetch.fetch(
      `/constructionprojects/${EPROID}`
    );
    const xml = await response.text();
    return this.createAndCacheProject(xml);
  }

  getFromCache(EPROID) {
    return this._cache[EPROID];
  }

  async getFromCacheOrApi(EPROID) {
    return this.getFromCache(EPROID) || (await this.get(EPROID));
  }

  async update(project) {
    const body = this._buildXMLRequest("modifyConstructionProject", project);
    const response = await this.authFetch.fetch(
      `/constructionprojects/${project.EPROID}`,
      {
        method: "put",

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
    const body = this._buildXMLRequest("addConstructionProject", project);
    const response = await this.authFetch.fetch("/constructionprojects/", {
      method: "post",

      body,
    });
    const xml = await response.text();
    return this.createAndCacheProject(xml);
  }

  searchProject(query) {
    return this.search(query, query.EPROID, {
      xmlMethod: "getConstructionProject",
      urlPath: "constructionprojects",
      listModel: ConstructionProjectsList,
      listKey: "constructionProject",
      searchKey: "constructionProjectsList",
    });
  }

  searchBuilding(query) {
    return this.search(query, query.EGID, {
      xmlMethod: "getBuilding",
      urlPath: "buildings",
      listModel: BuildingsList,
      listKey: "building",
      searchKey: "buildingsList",
    });
  }

  async search(
    query = {},
    id,
    { xmlMethod, urlPath, listModel, listKey, searchKey }
  ) {
    let response;
    if (id) {
      response = await this.authFetch.fetch(`/${urlPath}/${id}`);
      // The api returns a 404 if no results are found for the query
      if (!response.ok && response.status === 404) {
        return [];
      }
      return [new listModel(await response.text(), listKey)];
    }
    // We replace the newlines since they would be encoded in the query param
    // and this would break the xml.
    const queryXML = this._buildXMLRequest(xmlMethod, query).replace(
      /\r?\n|\r/g,
      ""
    );
    response = await this.authFetch.fetch(`/${urlPath}/`, {
      headers: {
        query: queryXML,
      },
    });
    // The api returns a 404 if no results are found for the query
    if (!response.ok && response.status === 404) {
      return [];
    }
    return new SearchResult(await response.text(), {
      [searchKey]: [listModel],
    })[searchKey];
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
    await this.authFetch.fetch(
      `/buildings/${EGID}/unbindToConstructionProject/${EPROID}`,
      {
        method: "put",
      }
    );
    // Refresh cache after removing the building
    await this.get(EPROID);
  }

  async bindBuildingToConstructionProject(EPROID, EGID, buildingWork) {
    const body = this._buildXMLRequest("bindBuildingToConstructionProject", {
      EPROID,
      EGID,
      ...buildingWork,
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
    this.get(EPROID);
  }

  // XML Handling

  // This is required since HBS acts on a global Handlebars object
  _hbs = Handlebars;
  _compiledTemplates = {};

  _buildXMLRequest(type, model, reason = "Modification enregistrement") {
    // Compile the needed templates on the fly so only
    // the ones used are compiled to remove a bit of over head.
    if (!this._compiledTemplates[type]) {
      this._compiledTemplates[type] = compile(Templates[type]);
    }

    return this._compiledTemplates[type](
      { model, reason },
      { allowProtoPropertiesByDefault: true }
    );
  }

  _setupHandlebarsPartials() {
    Object.keys(Partials).forEach((key) => {
      this._hbs.registerPartial(key, compile(Partials[key]));
    });

    Object.keys(Models).forEach((key) => {
      const Model = Models[key];
      if (Model.template) {
        this._hbs.registerPartial(key, compile(Model.template));
      }
    });

    Object.keys(Helpers).forEach((key) => {
      this._hbs.registerHelper(key, Helpers[key]);
    });
  }
}
