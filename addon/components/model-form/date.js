import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { Info } from "luxon";

// put the last element to the front of the array
const shift = (array) => [...array.slice(-1), ...array.slice(0, -1)];

export default class ModelFormDateComponent extends Component {
  @service intl;

  get pikadayTranslations() {
    const locale = this.intl.primaryLocale;

    return {
      previousMonth: this.intl.t("ember-gwr.previousMonth"),
      nextMonth: this.intl.t("ember-gwr.nextMonth"),
      months: Info.months("long", { locale }),
      weekdays: shift(Info.weekdays("long", { locale })),
      weekdaysShort: shift(Info.weekdays("short", { locale })),
    };
  }

  get yearRange() {
    return [2000, new Date().getFullYear()];
  }

  @action
  formatDate(value) {
    return this.intl.formatDate(value, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  @action
  clearDate(event) {
    event.preventDefault();
    this.args.update(null);
  }
}
