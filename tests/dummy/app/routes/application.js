import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

export default class ApplicationRoute extends Route {
  @service intl;

  beforeModel() {
    this.intl.setLocale(["de"]);
  }

  model() {
    let canton = localStorage.getItem("canton");
    if (!canton) {
      //eslint-disable-next-line no-alert
      canton = prompt("canton (BE|SZ)");
      localStorage.setItem("canton", canton);
    }
    return canton;
  }
}
