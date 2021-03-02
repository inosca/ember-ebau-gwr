import Controller from "@ember/controller";
import { assert } from "@ember/debug";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { task, lastValue } from "ember-concurrency-decorators";
import Options from "ember-ebau-gwr/models/options";

export default class ProjectFormController extends Controller {
  queryParams = ["import"];

  @service constructionProject;
  @service config;
  @service fetch;
  @service store;
  @service router;

  @tracked import = false;

  choiceOptions = Options;

  get currentRoute() {
    return this.router.currentRouteName;
  }

  @lastValue("fetchProject") project;
  @task
  *fetchProject() {
    return this.model.project?.isNew
      ? this.model.project
      : yield this.constructionProject.getFromCacheOrApi(this.model.projectId);
  }

  @lastValue("fetchCalumaData") importData;
  @task
  *fetchCalumaData() {
    assert(
      "importApi needs to be configured in gwr config service!",
      this.config.importApi
    );
    const response = yield this.fetch.fetch(
      this.config.importApi.replace("{instanceId}", this.model.instanceId)
    );
    return (yield response.json()).data;
  }

  @action
  importCalumaData() {
    this.project.typeOfConstructionProject = 6010;
    this.project.constructionProjectDescription =
      "Donec mollis hendrerit risus. Fusce ac felis sit amet ligula pharetra condimentum.";
    this.project.typeOfPermit = 5002;
    this.project.totalCostsOfProject = 10000;
    this.project.constructionSurveyDept = 134200;
    this.project.typeOfConstruction = 6223;
    this.project.projectAnnouncementDate = "11.12.2019";
    this.project.realestateIdentification.number = 83289;
    this.project.realestateIdentification.EGRID = 832891;
    this.project.typeOfClient = 6121;
    this.project.client.address.street = "Gässli";
    this.project.client.address.houseNumber = 5;
    this.project.client.identification.personIdentification.officialName =
      "Müller";
    this.project.client.identification.personIdentification.firstName = "Hans";
  }

  @action
  cancelMerge() {
    this.import = false;
    this.fetchProject.perform();
  }

  @action
  async saveProject() {
    if (this.project.isNew) {
      const project = await this.constructionProject.create(this.project);
      const link = this.store.createRecord("gwr-link", {
        eproid: project.EPROID,
        localid: this.model.instanceId,
      });
      await link.save();
      this.transitionToRoute("project.form", project.EPROID);
    } else {
      await this.constructionProject.update(this.project);
    }
    this.import = false;
  }
}
