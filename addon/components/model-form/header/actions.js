import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class ModelFormHeaderActionsComponent extends Component {
  @tracked showImportModal = false;
  @service importState;
  @service config;
}
