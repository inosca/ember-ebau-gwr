import Controller from "@ember/controller";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import {
  lastValue,
  restartableTask,
  enqueueTask,
} from "ember-concurrency-decorators";

export default class ProjectErrorsController extends Controller {
  @service constructionProject;
  @service building;
  @service buildingEntrance;
  @service dwelling;
  @service intl;
  @service notification;

  @tracked projectErrorCount = 0;
  @tracked buildingErrorCount = {};
  @tracked entranceErrorCount = {};
  @tracked dwellingErrorCount = {};

  @tracked buildings = {};

  @lastValue("fetchProject") project;
  @restartableTask
  *fetchProject() {
    const project = yield this.constructionProject.getFromCacheOrApi(
      this.model.projectId
    );

    this.projectErrorCount = project.errorList?.length ?? 0;

    return project;
  }

  @enqueueTask
  *fetchModel(buildingId) {
    // building response only contains entrances
    const building = yield this.building.getFromCacheOrApi(buildingId);
    this.buildingErrorCount = {
      ...this.buildingErrorCount,
      [buildingId]: building.errorList?.length ?? 0,
    };

    // response contains both entrances and dwellings
    const projectBuilding = this.project.work.find(
      (buildingWork) => buildingWork.building.EGID === buildingId
    ).building;

    const entrances = yield Promise.all(
      projectBuilding.buildingEntrance.map((entrance) =>
        this.buildingEntrance.getFromCacheOrApi(entrance.EDID, buildingId)
      )
    );

    this.entranceErrorCount = {
      ...this.entranceErrorCount,
      [buildingId]: entrances
        .map((entrance) => entrance.errorList?.length ?? 0)
        .reduce((a, b) => a + b, 0),
    };

    const dwellings = (yield Promise.all(
      projectBuilding.buildingEntrance.map((entrance) => {
        return Promise.all(
          entrance.dwelling.map((dwelling) =>
            this.dwelling.getFromCacheOrApi(dwelling.EWID, buildingId)
          )
        );
      })
    )).flat();

    this.dwellingErrorCount = {
      ...this.dwellingErrorCount,
      [buildingId]: dwellings
        .map((dwelling) => dwelling.errorList?.length ?? 0)
        .reduce((a, b) => a + b, 0),
    };

    this.buildings = {
      ...this.buildings,
      [buildingId]: { building, entrances, dwellings },
    };

    return building;
  }
}
