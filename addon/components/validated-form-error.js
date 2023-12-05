import { inject as service } from "@ember/service";
import Component from "@glimmer/component";

export default class ValidatedFormErrorComponent extends Component {
  @service intl;

  get errorString() {
    return this.args.errors
      ?.map((error) =>
        this.intl.t(`ember-gwr.validation-errors.${error.type}`, error.context),
      )
      .join(", ");
  }
}
