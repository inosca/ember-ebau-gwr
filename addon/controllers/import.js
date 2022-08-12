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
    return this.model.caseId
      ? {
          showImport: this.showImport,
          importIndex: this.importIndex,
          caseId: this.model.caseId,
        }
      : { showImport: false };
  }

  resetImportQueryParams() {
    this.showImport = false;
    this.importIndex = null;
  }
}
