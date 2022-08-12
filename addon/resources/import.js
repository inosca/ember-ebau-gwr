import { assert } from "@ember/debug";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { task, lastValue } from "ember-concurrency";
import { Resource } from "ember-resources";

const IMPORT_MAP = {
  project: "fetchProject",
  building: "fetchBuildings",
  dwelling: "fetchDwellings",
  buildingEntrance: "fetchEntrances",
};

export default class ImportResource extends Resource {
  @service dataImport;
  @service router;

  @tracked showImport = false;
  @tracked importIndex = null;
  @tracked error = null;

  get value() {
    const index = Number(this.importIndex);
    const data =
      Array.isArray(this.importData) && !isNaN(index)
        ? this.importData[index]
        : this.importData;

    return this.showImport && this.caseId
      ? {
          index,
          data,
          originalData: this.importData,
        }
      : false;
  }

  get isLoading() {
    return this.fetchCalumaData.isRunning;
  }

  get hasError() {
    return Boolean(this.error);
  }

  modify(_positional, { caseId, showImport, importIndex, importModelName }) {
    this.showImport = showImport;
    this.importIndex = importIndex;
    this.caseId = caseId;
    this.fetchCalumaData.perform(caseId, importModelName);
  }

  @lastValue("fetchCalumaData") importData;
  @task
  *fetchCalumaData(caseId, importModelName, ...args) {
    assert(
      "Must set `importModelName` to a string.",
      typeof importModelName === "string"
    );
    assert("Must set `caseId`.", caseId !== null && caseId !== undefined);
    try {
      return yield this.dataImport[IMPORT_MAP[importModelName]](
        caseId,
        ...args
      );
    } catch (error) {
      console.error(error);
      this.error = error;
      return error;
    }
  }
}
