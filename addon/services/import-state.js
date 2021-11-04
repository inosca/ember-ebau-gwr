import Service from "@ember/service";
import { tracked } from "@glimmer/tracking";

export default class ImportStateService extends Service {
  @tracked error;

  get hasError() {
    return Boolean(this.error);
  }
}
