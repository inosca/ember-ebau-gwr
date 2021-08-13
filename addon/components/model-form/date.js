import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

// TODO: remove file once two-way binding issue of value is resolved in ember-pikaday
// https://github.com/adopted-ember-addons/ember-pikaday/issues/212
export default class ModelFormDateComponent extends Component {
  @tracked value;

  constructor(...args) {
    super(...args);
    this.value = this.args.value;
  }
}
