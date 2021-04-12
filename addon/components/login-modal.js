import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class LoginModalComponent extends Component {
  @service authFetch;

  @tracked username = "";
  @tracked password = "";

  @action
  async login() {
    const token = await this.authFetch.housingStatToken.perform(
      this.username,
      this.password
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
