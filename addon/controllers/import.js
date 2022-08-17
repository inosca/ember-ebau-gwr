import Controller from "@ember/controller";
import { tracked } from "@glimmer/tracking";

export default class ImportController extends Controller {
  queryParams = [
    {
      showImport: "import",
      importIndex: "index",
    },
  ];

  @tracked showImport = false;
  @tracked importIndex = undefined;

  get importQueryParams() {
    return this.model.instanceId
      ? {
          showImport: this.showImport,
          importIndex: this.importIndex,
          instanceId: this.model.instanceId,
        }
      : { showImport: false };
  }

  resetImportQueryParams() {
    this.showImport = false;
    this.importIndex = null;
  }
}
