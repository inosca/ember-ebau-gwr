import Controller from "@ember/controller";
import { tracked } from "@glimmer/tracking";

export default class ImportController extends Controller {
  queryParams = [{ _showImport: "import" }, { importIndex: "index" }];

  @tracked _showImport = false;
  @tracked importIndex = undefined;

  get showImport(){
    return Boolean(this.model.instanceId && this._showImport)
  }

  get hasInstanceContext() {
    return Boolean(this.model.instanceId);
  }

  resetImportQueryParams() {
    this.showImport = false;
    this.importIndex = null;
  }
}
