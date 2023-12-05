import Controller from "@ember/controller";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { lastValue, restartableTask, enqueueTask } from "ember-concurrency";

export default class ProjectErrorsController extends Controller {
  @service constructionProject;
  @service building;
  @service buildingEntrance;
  @service dwelling;
  @service intl;
  @service notification;

  @tracked projectErrorCount = 0;

  @lastValue("fetchProject") project;
  @restartableTask
  *fetchProject() {
    const project = yield this.constructionProject.getFromCacheOrApi(
      this.model.projectId,
    );

    this.projectErrorCount = project.errorList?.length ?? 0;

    return project;
  }

  get workBuildings() {
    return this.project.work
      .filter((w) => !w.building.isNew)
      .map((w) => w.building);
  }

  @enqueueTask
  *fetchModel(buildingId) {
    // building response only contains entrances
    const buildingWithErrors =
      yield this.building.getFromCacheOrApi(buildingId);
    const buildingErrorCount = buildingWithErrors.errorList?.length ?? 0;

    // response contains both entrances and dwellings
    const projectBuilding = this.project.work.find(
      (buildingWork) => buildingWork.building.EGID === buildingId,
    ).building;

    const entrancesWithErrors = yield Promise.all(
      projectBuilding.buildingEntrance.map((entrance) =>
        this.buildingEntrance.getFromCacheOrApi(entrance.EDID, buildingId),
      ),
    );

    const entranceErrorCount = entrancesWithErrors
      .map((entrance) => entrance.errorList?.length ?? 0)
      .reduce((a, b) => a + b, 0);

    const dwellingsWithErrors = (yield Promise.all(
      projectBuilding.buildingEntrance.map((entrance) => {
        return Promise.all(
          entrance.dwelling.map((dwelling) =>
            this.dwelling.getFromCacheOrApi(dwelling.EWID, buildingId),
          ),
        );
      }),
    )).flat();

    const dwellingErrorCount = dwellingsWithErrors
      .map((dwelling) => dwelling.dwelling.errorList?.length ?? 0)
      .reduce((a, b) => a + b, 0);

    return {
      buildingWithErrors,
      buildingErrorCount,
      entrancesWithErrors,
      entranceErrorCount,
      dwellingsWithErrors,
      dwellingErrorCount,
    };
  }
}
