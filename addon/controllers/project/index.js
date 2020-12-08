import Controller from "@ember/controller";
import { tracked } from "@glimmer/tracking";
import { task, lastValue } from "ember-concurrency-decorators";
import { action } from "@ember/object";

export default class ProjectIndexController extends Controller {
  queryParams = ["createNewProject", "import"];

  @tracked createNewProject = false;
  @tracked import = false;
  @tracked hasExistingProject = false;

  @tracked isLoadin;

  constructor(...args) {
    super(...args);
    this.fetchProject.perform();
  }

  get displayLanding() {
    return !this.createNewProject && !this.hasExistingProject;
  }

  @lastValue("fetchProject") project;
  @task
  *fetchProject() {
    console.log("fertching project");
    const project = yield localStorage.getItem("project");
    if (!project) {
      return {
        realestateIdentification: {},
        client: { identification: { personIdentification: {} }, address: {} },
      };
    }
    this.hasExistingProject = true;
    return yield JSON.parse(project);
  }

  @lastValue("importCalumaData") importData;
  @task
  *importCalumaData() {
    if (this.import) {
      const importData = {
        typeOfConstructionProject: this.typeOfConstructionProject,
        constructionProjectDescription:
          "Donec mollis hendrerit risus. Fusce ac felis sit amet ligula pharetra condimentum.",
        typeOfConstruction: "Elektrizitätswerke",
        totalCostsOfProject: 10000,
        typeOfPermit: "Bewilligungsgrund 2",
        projectAnnouncementDate: "11.12.2019",
        realestateIdentification: this.realestateIdentification,
        typeOfClient: this.typeOfClient,
        client: {
          address: { street: "Gässli", houseNumber: 5 },
          identification: {
            personIdentification: { officialName: "Müller" },
          },
        },
      };

      if (this.createNewProject) {
        this.project = { ...this.project, ...importData };
        this.saveProject();
      } else {
        return importData;
      }
    }
  }

  @action
  cancelMerge(attr, value) {
    this.import = false;
    this.fetchProject.perform();
  }

  @action
  saveProject() {
    localStorage.setItem("project", JSON.stringify(this.project));
    this.import = false;
    this.createNewProject = false;
    this.fetchProject.perform();
  }
}
