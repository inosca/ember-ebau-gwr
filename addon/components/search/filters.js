import { action, set } from "@ember/object";
import Component from "@glimmer/component";

export default class SearchFiltersComponent extends Component {
  query = { realestateIdentification: {}, createDate: {}, modifyDate: {} };

  @action
  updateField(fieldName, value) {
    set(this.query, fieldName, value);
  }

  @action
  submit(event) {
    event.preventDefault();
    this.args.search(this.query);
  }
}
