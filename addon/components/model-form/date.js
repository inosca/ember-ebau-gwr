import Component from "@glimmer/component";

// TODO: remove file once two-way binding issue of value is resolved in ember-pikaday
// https://github.com/adopted-ember-addons/ember-pikaday/issues/212
export default class ModelFormDateComponent extends Component {
  get value() {
    return this.args.value;
  }

  // prevent pikaday two-way binding from
  // updating "value" field on input
  set value(value) {}
}
