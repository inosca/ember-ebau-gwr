import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { dropTask } from "ember-concurrency";

export default class LogoutComponent extends Component {
  @service authFetch;

  @dropTask
  *logout() {
    yield this.authFetch.clearHousingStatCredentials.perform();
  }

  get isLoading() {
    return this.authFetch.clearHousingStatCredentials.isRunning;
  }
}
