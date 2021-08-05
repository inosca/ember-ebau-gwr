import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class ImportModalComponent extends Component {
  @service config;

  @tracked showImportModal = false;
  @tracked importIndex = 0;
}
