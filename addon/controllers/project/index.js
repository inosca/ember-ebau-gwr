import Controller from "@ember/controller";
import { tracked } from "@glimmer/tracking";
import { task, lastValue } from "ember-concurrency-decorators";
import EmberObject, { action } from "@ember/object";
import {
  Project,
  Client,
  Address,
  Identification,
  PersonIdentification,
} from "ember-ebau-gwr/models/models";
import {
  typeOfClientOptions,
  typeOfConstructionOptions,
  typeOfConstructionProjectOptions,
  typeOfPermitOptions,
} from "ember-ebau-gwr/models/options";
import { inject as service } from "@ember/service";

export default class ProjectIndexController extends Controller {
  queryParams = ["import"];

  @service constructionProject;

  @tracked import = false;

  choiceOptions = {
    typeOfClientOptions,
    typeOfConstructionOptions,
    typeOfConstructionProjectOptions,
    typeOfPermitOptions,
  };

  get isNewProject() {
    return !Boolean(this.model.EPROID);
  }

  @lastValue("fetchCalumaData") importData;
  @task
  *fetchCalumaData() {
    const importData = new Project({
      constructionProjectDescription:
        "Donec mollis hendrerit risus. Fusce ac felis sit amet ligula pharetra condimentum.",
      typeOfConstruction: "Elektrizitätswerke",
      totalCostsOfProject: 10000,
      typeOfPermit: "Bewilligungsgrund 2",
      projectAnnouncementDate: "11.12.2019",
      typeOfClient: this.typeOfClient,
      client: new Client({
        address: new Address({ street: "Gässli", houseNumber: 5 }),
        identification: new Identification({
          personIdentification: new PersonIdentification({
            officialName: "Müller",
          }),
        }),
      }),
    });

    return importData;
  }

  @task
  *importCalumaData() {
    this.model.constructionProjectDescription =
      "Donec mollis hendrerit risus. Fusce ac felis sit amet ligula pharetra condimentum.";
    this.model.typeOfConstruction = "Elektrizitätswerke";
    this.model.totalCostsOfProject = 10000;
    this.model.typeOfPermit = "Bewilligungsgrund 2";
    this.model.projectAnnouncementDate = "11.12.2019";
    this.model.typeOfClient = this.typeOfClient;
    this.model.client = new Client({
      address: new Address({ street: "Gässli", houseNumber: 5 }),
      identification: new Identification({
        personIdentification: new PersonIdentification({
          officialName: "Müller",
        }),
      }),
    });
  }

  @action
  cancelMerge(attr, value) {
    this.import = false;
    this.fetchProject.perform();
  }

  @action
  saveProject(event) {
    this.constructionProject.update(this.model);
    this.transitionToRoute("project", { queryParams: { import: false } });
  }
}
