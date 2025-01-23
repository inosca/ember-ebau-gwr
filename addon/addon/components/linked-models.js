import { inject as service } from "@ember/service";
import Component from "@glimmer/component";

export default class LinkedModelsComponent extends Component {
  @service config;
}
