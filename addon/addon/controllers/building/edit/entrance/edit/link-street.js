import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { task, lastValue } from "ember-concurrency";

export default class BuildingEditEntranceLinkStreetController extends Controller {
  queryParams = ["locality", "PLZ4", "PLZ6"];

  @service street;
  @service buildingEntrance;
  @service building;
  @service notification;
  @service intl;
  @service router;

  // A locality is uniquely described by either
  // locality name + PLZ4 or PLZ4 + PLZ6
  @tracked locality = null;
  @tracked PLZ4 = null;
  @tracked PLZ6 = null;

  get baseQuery() {
    return {
      description: {
        descriptionLong: "",
      },
      locality: {
        swissZipCode: this.PLZ4,
        swissZipCodeAddOn: this.PLZ6,
        name: {
          nameLong: this.locality,
        },
      },
      language: this.street.language,
    };
  }

  get backRoute() {
    if (this.model.buildingId === "new") {
      return "building.new";
    }

    return `building.edit.entrance.${
      this.buildingEntrance.isNew ? "new" : "edit.index"
    }`;
  }

  get backRouteLabel() {
    return this.intl.t(
      `ember-gwr.buildingEntrance.${
        this.model.buildingId === "new" ? "backToBuilding" : "backToEntrance"
      }`,
    );
  }

  @lastValue("search") searchResults;
  @task
  *search(query) {
    try {
      query.language = this.street.language;
      return yield this.street.search(query);
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t("ember-gwr.generalErrors.searchError"),
      );
    }
  }

  @action
  async setStreet(street) {
    try {
      const entrance = await this.buildingEntrance.getFromCacheOrApi(
        this.model.entranceId,
        this.model.buildingId,
      );
      entrance.street = street;
      await this.buildingEntrance.setStreet(
        this.model.entranceId,
        this.model.buildingId,
        entrance,
      );
      // Ensure building entrance list is updated
      this.building.clearCache(this.model.buildingId);
      this.router.transitionTo(this.backRoute);
      this.notification.success(
        this.intl.t("ember-gwr.components.linkStreet.linkSuccess"),
      );
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t("ember-gwr.components.linkStreet.linkError"),
      );
    }
  }
}
