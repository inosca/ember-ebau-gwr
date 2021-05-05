import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import config from "ember-ebau-gwr/config/environment";

export default class LoginModalComponent extends Component {
  @service authFetch;
  @service config;

  @tracked username = "";
  @tracked password = "";
  @tracked municipality;

  get municipalities() {
    return config.municipalities[this.config.cantonAbbreviation];
  }

  @action
  async login() {
    const token = await this.authFetch.housingStatToken.perform(
      this.username,
      this.password,
      this.municipality
    );
    if (token) {
      this.authFetch.showAuthModal = false;
    }
  }

  @action
  updateValue({ target: { name, value } = {} }) {
    this[name] = value;
  }
}
