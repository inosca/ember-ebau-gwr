import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import {
  REQUEST_PENDING,
  WAITING,
  PROCESSING,
  ERROR,
  CLOSED,
} from "ember-ebau-gwr/models/quarterly-closure-status";
export default class QuarterlyClosureStatus extends Component {
  @service quarterlyClosure;

  get statusClass() {
    switch (this.quarterlyClosure.status.type) {
      case REQUEST_PENDING: {
        return { text: "uk-text-meta", icon: "clock" };
      }
      case WAITING: {
        return { text: "uk-text-warning", icon: "circle-info" };
      }
      case PROCESSING: {
        return { text: "uk-text-muted", icon: "clock" };
      }
      case ERROR: {
        return { text: "uk-text-danger", icon: "triangle-exclamation" };
      }
      case CLOSED: {
        return { text: "uk-text-success", icon: "circle-check" };
      }
      default: {
        return { text: "uk-text-default" };
      }
    }
  }
}
