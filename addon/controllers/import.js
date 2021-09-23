import Controller from "@ember/controller";
import { inject as service } from "@ember/service";
import { task, dropTask, lastValue } from "ember-concurrency-decorators";
import { tracked } from "@glimmer/tracking";
import { assert } from "@ember/debug";

const IMPORT_MAP = {
  project: "fetchProject",
  building: "fetchBuildingsFromProject",
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
      Array.isArray(this.importData) && typeof index === "number"
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
    console.log("fetchCalumaData");
    assert(
      "Must set `importModelName` to a string.",
      typeof this.importModelName === "string"
    );
    return yield this.dataImport[IMPORT_MAP[this.importModelName]](...args);
  }
}
