import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { task, lastValue } from "ember-concurrency-decorators";
import { languageOptions } from "ember-ebau-gwr/models/options";

export default class BuildingEditEntranceLinkStreetController extends Controller {
  queryParams = ["locality"];

  @service street;
  @service buildingEntrance;
  @service building;
  @service notification;
  @service intl;

  @tracked locality = null;

  get baseQuery() {
    return {
      description: {},
      locality: {
        name: {
          nameLong: this.locality,
        },
      },
    };
  }

  get backRoute() {
    if (this.model.buildingId === "new") {
      return "building.new";
    }

    return `building.edit.entrance.${
      this.buildingEntrance.newRecord ? "new" : "edit.index"
    }`;
  }

  get backRouteLabel() {
    return this.intl.t(
      `ember-gwr.buildingEntrance.${
        this.model.buildingId === "new" ? "backToBuilding" : "backToEntrance"
      }`
    );
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
      // check whether street is being set from new entrance form or new building form
      if (this.buildingEntrance.newRecord && this.model.buildingId !== "new") {
        this.buildingEntrance.newRecord.street = street;
      } else if (this.building.newRecord) {
        this.building.newRecord.building.buildingEntrance.street = street;
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
        this.intl.t("ember-gwr.components.linkStreet.linkSuccess")
      );
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t("ember-gwr.components.linkStreet.linkError")
      );
    }
  }
}
