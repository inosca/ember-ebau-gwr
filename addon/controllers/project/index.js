import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { task, lastValue } from "ember-concurrency-decorators";
import Options from "ember-ebau-gwr/models/options";

export default class ProjectIndexController extends Controller {
  queryParams = ["import"];

  @service constructionProject;

  @tracked import = false;

  choiceOptions = Options;

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
  cancelMerge() {
    this.import = false;
    this.fetchProject.perform();
  }

  @action
  async saveProject() {
    this.model = await (this.model.isNew
      ? this.constructionProject.create(this.model)
      : this.constructionProject.update(this.model));
    this.transitionToRoute("project", { queryParams: { import: false } });
  }
}
