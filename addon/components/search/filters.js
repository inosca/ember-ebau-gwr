import { action, set } from "@ember/object";
import Component from "@glimmer/component";
import { projectStatusOptions } from "ember-ebau-gwr/models/options";

export default class SearchFiltersComponent extends Component {
  query = { realestateIdentification: {}, createDate: {}, modifyDate: {} };

  @action
  updateField(fieldName, eventOrValue) {
    const value = eventOrValue?.target?.value ?? eventOrValue;
    set(this.query, fieldName, value);
    console.log(this.query);
  }

  @action
  submit(event) {
    event.preventDefault();
    this.args.search(this.query);
  }
}
