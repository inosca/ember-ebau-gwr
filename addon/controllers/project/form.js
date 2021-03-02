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
  @service dataImport;
  @service store;
  @service router;

  @tracked import = false;

  choiceOptions = Options;

  get currentRoute() {
    return this.router.currentRoute.name;
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
    const response = yield this.dataImport.fetchProject(
      this.config.importApi.replace("{instanceId}", this.model.instanceId)
    );
    return (yield response.json()).data;
  }

  @action
  importCalumaData() {
    // We cannot just `Object.assign` here since the child object like `identification` would
    // not be classes with tracked fields etc. anymore but just pojos. We need to preserve the classes.
    const deepMerge = (original, objectToApply) => {
      Object.entries(objectToApply).forEach(([key, value]) => {
        typeof value === "object"
          ? deepMerge(original[key], objectToApply[key])
          : (original[key] = value);
      });
    };
    deepMerge(this.project, this.importData);
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
