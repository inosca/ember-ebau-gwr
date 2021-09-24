import Controller from "@ember/controller";
import { assert } from "@ember/debug";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { task, lastValue } from "ember-concurrency-decorators";

const IMPORT_MAP = {
  project: "fetchProject",
  building: "fetchBuildings",
  dwelling: "fetchDwellings",
  buildingEntrance: "fetchEntrances",
};

export default class ImportController extends Controller {
  queryParams = [
    {
      showImport: "import",
      importIndex: "index",
    },
  ];

  @service dataImport;

  @tracked showImport = false;
  @tracked importIndex = undefined;

  get import() {
    if (this.showImport) {
      assert("`fetchCalumaData` was never called.", this.importData);
    }

    const index = Number(this.importIndex);
    const data =
      Array.isArray(this.importData) && !isNaN(index)
        ? this.importData[index]
        : this.importData;

    return this.showImport
      ? {
          index,
          data,
          originalData: this.importData,
        }
      : false;
  }

  resetImport() {
    this.showImport = false;
    this.importIndex = null;
  }

  @lastValue("fetchCalumaData") importData;
  @task
  *fetchCalumaData(...args) {
    assert(
      "Must set `importModelName` to a string.",
      typeof this.importModelName === "string"
    );
    return yield this.dataImport[IMPORT_MAP[this.importModelName]](...args);
  }
}
