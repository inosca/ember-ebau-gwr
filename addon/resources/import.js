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
      Array.isArray(this.importedData) && !isNaN(index)
        ? this.importedData[index]
        : this.importedData;

    return this.showImport && this.instanceId
      ? {
          index,
          data,
          originalData: this.importedData,
        }
      : false;
  }

  get isLoading() {
    return this.fetchCalumaData.isRunning;
  }

  get hasError() {
    return Boolean(this.error);
  }

  modify(
    _positional,
    { instanceId, showImport, importIndex, importModelName }
  ) {
    this.showImport = showImport;
    this.importIndex = importIndex;
    this.instanceId = instanceId;
    this.fetchCalumaData.perform(instanceId, importModelName);
  }

  @lastValue("fetchCalumaData") importedData;
  @task
  *fetchCalumaData(instanceId, importModelName, ...args) {
    assert(
      "Must set `importModelName` to a string.",
      typeof importModelName === "string"
    );
    assert(
      "Must set `instanceId`.",
      instanceId !== null && instanceId !== undefined
    );
    try {
      return yield this.dataImport[IMPORT_MAP[importModelName]](
        instanceId,
        ...args
      );
    } catch (error) {
      console.error(error);
      this.error = error;
      return error;
    }
  }
}
