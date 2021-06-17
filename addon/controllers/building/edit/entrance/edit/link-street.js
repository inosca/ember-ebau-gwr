import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { task, lastValue } from "ember-concurrency-decorators";
import { languageOptions } from "ember-ebau-gwr/models/options";

export default class BuildingEditEntranceLinkStreetController extends Controller {
  @service street;
  @service buildingEntrance;
  @service notification;
  @service intl;

  get baseQuery() {
    return {
      description: {},
      locality: { name: {} },
    };
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
      this.notification.success(
        this.intl.t("ember-gwr.buildingEntrance.linkStreet.linkSuccess")
      );
      this.transitionToRoute("building.edit.entrance.edit.index");
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t("ember-gwr.buildingEntrance.linkStreet.linkError")
      );
    }
  }
}
