import Component from "@glimmer/component";
import { action } from "@ember/object";

export default class LinkModelsComponent extends Component {
  @action
  addLink(event) {
    event.preventDefault();
    this.args.addLink(event);
  }
}
