import Helper from "@ember/component/helper";
import { inject as service } from "@ember/service";

export default class BuildUrl extends Helper {
  @service router;

  compute([routeName, models = []]) {
    return this.router.urlFor(routeName, ...models);
  }
}
