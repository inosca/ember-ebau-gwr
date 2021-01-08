import Controller from "@ember/controller";
import { tracked } from "@glimmer/tracking";
import { task, lastValue } from "ember-concurrency-decorators";
import EmberObject, { action } from "@ember/object";

import {
  ConstructionProject,
  Client,
  Address,
  Identification,
  PersonIdentification,
} from "ember-ebau-gwr/models";
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
    const importData = {
      constructionProjectDescription:
        "Donec mollis hendrerit risus. Fusce ac felis sit amet ligula pharetra condimentum.",
      typeOfConstruction: "Elektrizitätswerke",
      totalCostsOfProject: 10000,
      typeOfPermit: "Bewilligungsgrund 2",
      projectAnnouncementDate: "11.12.2019",
      client: {
        address: { street: "Gässli", houseNumber: 5 },
        identification: {
          personIdentification: {
            officialName: "Müller",
          },
        },
      },
    };

    return importData;
  }

  @task
  *importCalumaData() {
    this.model.typeOfConstructionProject = 6010;
    this.model.constructionProjectDescription =
      "Donec mollis hendrerit risus. Fusce ac felis sit amet ligula pharetra condimentum.";
    this.model.typeOfPermit = 5002;
    this.model.totalCostsOfProject = 10000;
    this.model.constructionSurveyDept = 81298;
    this.model.typeOfConstruction = 6223;
    this.model.projectAnnouncementDate = "11.12.2019";
    this.model.realestateIdentification.number = 83289;
    this.model.realestateIdentification.EGRID = 832891;
    this.model.typeOfClient = 6121;
    this.model.client.address.street = "Gässli";
    this.model.client.address.houseNumber = 5;
    this.model.client.identification.personIdentification.officialName =
      "Müller";
    this.model.client.identification.personIdentification.firstName = "Hans";
  }

  @action
  cancelMerge(attr, value) {
    this.import = false;
    this.fetchProject.perform();
  }

  @action
  saveProject(event) {
    debugger;
    console.log(this.model, this.model.isNew);
    this.isNewProject
      ? this.constructionProject.create(this.model)
      : this.constructionProject.update(this.model);
    this.transitionToRoute("project", { queryParams: { import: false } });
  }
}
