import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { task, lastValue } from "ember-concurrency";
import Street from "ember-ebau-gwr/models/street";

export default class LinkStreetComponent extends Component {
  Street = Street;

  @service config;
  @service("street") streetAPI;

  constructor(...args) {
    super(...args);
    this.fetchStreet.perform();
  }

  @lastValue("fetchStreet") street;
  @task
  *fetchStreet() {
    if (!this.args.buildingEntrance.isNew) {
      return yield this.streetAPI.get(this.args.buildingEntrance.street.ESID);
    }
  }
}
