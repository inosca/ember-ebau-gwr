import Controller from "@ember/controller";
import { inject as service } from "@ember/service";
import { task, lastValue } from "ember-concurrency-decorators";
import Models from "ember-ebau-gwr/models";

export default class BuildingEditDwellingEditController extends Controller {
  Models = Models;

  @service("dwelling") dwellingAPI;
  @service building;
  @service intl;
  @service notification;

  @lastValue("fetchDwelling") dwelling;
  @task
  *fetchDwelling() {
    try {
      if (this.model.dwelling?.isNew) {
        yield this.fetchEntrances.perform();
        return this.model.dwelling;
      }

      return yield this.dwellingAPI.getFromCacheOrApi(
        this.model.dwellingId,
        this.model.buildingId
      );
    } catch (error) {
      console.error(error);
      this.notification.danger(this.intl.t("ember-gwr.dwelling.loadingError"));
    }
  }

  @lastValue("fetchEntrances") entrances;
  @task
  *fetchEntrances() {
    try {
      const building = yield this.building.getFromCacheOrApi(
        this.model.buildingId
      );
      return building.buildingEntrance;
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t("ember-gwr.building.entrances.error")
      );
    }
  }

  @task
  *saveDwelling() {
    try {
      if (this.dwelling.isNew) {
        const dwelling = yield this.dwellingAPI.create(
          this.dwelling,
          this.model.buildingId
        );
        this.transitionToRoute("building.edit.dwelling.edit", dwelling.EDID);
      } else {
        yield this.dwellingAPI.update(this.dwelling, this.model.buildingId);
      }
      this.notification.success(this.intl.t("ember-gwr.dwelling.saveSuccess"));
    } catch (error) {
      console.error(error);
      this.notification.danger(this.intl.t("ember-gwr.dwelling.saveError"));
    }
  }
}
