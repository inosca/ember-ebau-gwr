import { action } from "@ember/object";
import Component from "@glimmer/component";

export default class LinkModelsComponent extends Component {
  @action
  addLink(event) {
    event.preventDefault();
    this.args.addLink(event);
  }
}
