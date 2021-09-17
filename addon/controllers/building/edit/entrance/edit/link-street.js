import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { task, lastValue } from "ember-concurrency-decorators";
import { languageOptions } from "ember-ebau-gwr/models/options";

export default class BuildingEditEntranceLinkStreetController extends Controller {
  @service street;
  @service buildingEntrance;
  @service building;
  @service notification;
  @service intl;

  get baseQuery() {
    return {
      description: {},
      locality: { name: {} },
    };
  }

  get backRoute() {
    console.log("buildingId:", this.model.buildingId);
    if (this.model.buildingId === "new") {
      return "building.new";
    }

    return `building.edit.entrance.${
      this.buildingEntrance.newRecord ? "new" : "edit.index"
    }`;
  }

  get backRouteLabel() {
    return this.intl.t(this.model.buildingId === "new"
      ? "ember-gwr.buildingEntrance.backToBuilding"
      : "ember-gwr.buildingEntrance.backToEntrance");
  }

  @lastValue("search") searchResults;
  @task
  *search(query) {
    try {
      query.language = languageOptions[this.intl.primaryLocale];
      return yield this.street.search(query);
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t("ember-gwr.generalErrors.searchError")
      );
    }
  }

  @action
  async setStreet(street) {
    try {
      if (this.buildingEntrance.newRecord) {
        this.buildingEntrance.newRecord.street = street;
      } else if (this.building.newRecord) {
        this.building.newRecord.building.buildingEntrance[0].street = street;
      } else {
        const entrance = await this.buildingEntrance.getFromCacheOrApi(
          this.model.entranceId,
          this.model.buildingId
        );
        await this.buildingEntrance.setStreet(
          this.model.entranceId,
          this.model.buildingId,
          entrance.EGAID,
          street
        );
      }
      this.transitionToRoute(this.backRoute);
      this.notification.success(
        this.intl.t("ember-gwr.buildingEntrance.linkStreet.linkSuccess")
      );
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t("ember-gwr.buildingEntrance.linkStreet.linkError")
      );
    }
  }
}
