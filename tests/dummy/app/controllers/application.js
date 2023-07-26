import Controller from "@ember/controller";
import { tracked } from "@glimmer/tracking";

export default class ApplicationController extends Controller {
  @tracked canton;

  constructor(...args) {
    super(...args);
    let canton = localStorage.getItem("canton");
    if (!canton) {
      //eslint-disable-next-line no-alert
      canton = prompt("canton (BE|SZ)");
      localStorage.setItem("canton", canton);
    }
    this.canton = canton;
  }
}
