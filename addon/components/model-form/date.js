import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { DateTime } from "luxon";

export default class ModelFormDateComponent extends Component {
  @service intl;

  get locale() {
    const lang = this.intl.primaryLocale.split("-")[0];

    // Workaround for https://github.com/RobbieTheWagner/ember-flatpickr/pull/2098
    return lang === "en" ? null : lang;
  }

  get minDate() {
    return new Date(2000, 0, 1);
  }

  get maxDate() {
    return DateTime.now().endOf("year").toJSDate();
  }

  get yearRange() {
    return [2000, new Date().getFullYear()];
  }

  @action
  onChange(dates) {
    if (!dates.length) {
      this.args.update(null);
    } else {
      this.args.update(DateTime.fromJSDate(dates[0]).toISODate());
    }
  }
}
