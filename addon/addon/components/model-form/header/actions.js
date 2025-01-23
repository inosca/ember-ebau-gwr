import { inject as service } from "@ember/service";
import Component from "@glimmer/component";

export default class ModelFormHeaderActionsComponent extends Component {
  @service config;

  get showImportModal() {
    return (
      this.args.import?.originalData?.length && isNaN(this.args.import?.index)
    );
  }
}
