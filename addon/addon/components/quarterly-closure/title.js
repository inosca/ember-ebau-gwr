import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { ERROR } from "ember-ebau-gwr/models/quarterly-closure-status";

export default class QuarterlyClosureTitle extends Component {
  @service quarterlyClosure;

  get displayErrorInfo() {
    return this.quarterlyClosure.status.type === ERROR;
  }
}
