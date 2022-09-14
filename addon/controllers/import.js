import Controller from "@ember/controller";
import { tracked } from "@glimmer/tracking";

export default class ImportController extends Controller {
  queryParams = [{ _showImport: "import" }, { importIndex: "index" }];

  @tracked _showImport = false;
  @tracked importIndex = null;

  get showImport() {
    return Boolean(this.model.instanceId && this._showImport);
  }

  get hasProjectContext() {
    return Boolean(this.model.projectId);
  }

  resetImportQueryParams() {
    this._showImport = false;
    this.importIndex = null;
  }
}
