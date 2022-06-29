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

  resetImportQueryParams() {
    this.showImport = false;
    this.importIndex = null;
  }
}
