import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { isBlank } from "@ember/utils";
import { tracked } from "@glimmer/tracking";
import { task, timeout } from "ember-concurrency";
import ValidatedInput from "ember-validated-form/components/validated-input";

export default class SearchStreetComponent extends ValidatedInput {
  @service("street") streetAPI;
  @service notification;
  @service intl;

  @tracked searchTerm = "";

  get swissZipCode() {
    return this.args.options.locality.swissZipCode;
  }

  get swissZipCodeAddOn() {
    return this.args.options.locality.swissZipCodeAddOn;
  }

  get query() {
    return {
      description: {
        // '*' enable fuzzy search
        descriptionLong: `*${this.searchTerm}*`,
      },
      locality: {
        swissZipCode: this.swissZipCode,
        swissZipCodeAddOn: this.swissZipCodeAddOn,
      },
      language: this.streetAPI.language,
    };
  }

  search = task(this, { restartable: true }, async (nameLong) => {
    await timeout(500);

    this.searchTerm = nameLong;

    if (nameLong.length < 2) {
      return;
    }

    try {
      return await this.streetAPI.search(this.query);
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t("ember-gwr.generalErrors.searchError"),
      );
    }
  });

  @action
  handleFocus(select, e) {
    if (this.focusComesFromOutside(e)) {
      select.actions.open();
    }
  }

  // copied from ember-power-select documentation
  // https://github.com/cibernox/ember-power-select/blob/master/docs/app/components/snippets/action-handling-5.js
  focusComesFromOutside(e) {
    const blurredEl = e.relatedTarget;
    if (isBlank(blurredEl)) {
      return false;
    }
    return !blurredEl.classList.contains("ember-power-select-search-input");
  }
}
