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
      displayImport: "import",
      importIndex: "index",
    },
  ];

  @service dataImport;

  @tracked displayImport = false;
  @tracked importIndex = undefined;

  get import() {
    const index = Number(this.importIndex);
    const data =
      Array.isArray(this.importData) && typeof index === "number"
        ? this.importData[index]
        : this.importData;

    return this.displayImport
      ? {
          index,
          data,
          originalData: this.importData,
        }
      : false;
  }

  resetImport() {
    this.displayImport = false;
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
