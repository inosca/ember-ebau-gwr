import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { task } from "ember-concurrency";
import {
  WAITING,
  PROCESSING,
  ERROR,
  CLOSED,
} from "ember-ebau-gwr/models/quarterly-closure-status";

const NOTIFICATION_TYPES = {
  [WAITING]: "warning",
  [PROCESSING]: "primary",
  [ERROR]: "danger",
  [CLOSED]: "success",
};

export default class QuarterlyClosureStatus extends Component {
  @service quarterlyClosure;
  @service notification;
  @service intl;

  get disabledButton() {
    return ![620, 630, 650, 651, 663, 665].includes(
      this.quarterlyClosure.status.id,
    );
  }

  @task
  *closeQuarterlySurvey() {
    try {
      yield this.quarterlyClosure.close();

      const notificationType =
        NOTIFICATION_TYPES[this.quarterlyClosure.status.type];
      this.notification[notificationType]?.(
        this.quarterlyClosure.status.shortLabel,
      );
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t("ember-gwr.quarterlyClosure.closure.error"),
      );
    }
  }
}
