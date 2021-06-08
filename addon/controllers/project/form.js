import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { task, lastValue } from "ember-concurrency-decorators";
import Options from "ember-ebau-gwr/models/options";

export default class ProjectFormController extends Controller {
  queryParams = ["import"];

  @service gwr;
  @service config;
  @service dataImport;
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
      : yield this.gwr.getFromCacheOrApi(this.model.projectId);
  }

  @lastValue("fetchCalumaData") importData;
  @task
  *fetchCalumaData() {
    return yield this.dataImport.fetchProject(this.model.instanceId);
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

  @task
  *saveProject() {
    try {
      if (this.project.isNew) {
        const project = yield this.gwr.create(this.project);
        const link = this.store.createRecord("gwr-link", {
          eproid: project.EPROID,
          localId: this.model.instanceId,
        });
        yield link.save();
        // Reload the overview table to display the new project
        yield this.gwr.all.perform(this.model.instanceId);
        this.transitionToRoute("project.form", project.EPROID);
      } else {
        yield this.gwr.update(this.project);
      }
      this.import = false;
      this.notification.success(
        this.intl.t("ember-gwr.constructionProject.saveSuccess")
      );
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t("ember-gwr.constructionProject.saveError")
      );
    }
  }
}
