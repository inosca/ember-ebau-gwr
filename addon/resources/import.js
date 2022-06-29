import { Resource } from "ember-resources";
import { assert } from "@ember/debug";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { task, lastValue } from "ember-concurrency";

const IMPORT_MAP = {
  project: "fetchProject",
  building: "fetchBuildings",
  dwelling: "fetchDwellings",
  buildingEntrance: "fetchEntrances",
};

export default class ImportResource extends Resource {
  @service dataImport;
  @service router;

  @tracked importModelName = null;

  @tracked showImport = false;
  @tracked importIndex = null;
  @tracked error = null;

  get value() {
    if (this.showImport) {
      assert("`fetchCalumaData` was never called.", this.importData);
    }

    const index = Number(this.importIndex);
    const data =
      Array.isArray(this.importData) && !isNaN(index)
        ? this.importData[index]
        : this.importData;

    return this.showImport && this.model.instanceId
      ? {
          index,
          data,
          originalData: this.importData,
        }
      : false;
  }

  get isRunning() {
    return this.fetchCalumaData.isRunning;
  }

  get hasError() {
    return Boolean(this.error);
  }

  modify({ model, showImport, importIndex, importModelName }) {
    this.showImport = showImport;
    this.importIndex = importIndex;
    this.fetchCalumaData.perform(model, importModelName);
  }

  @lastValue("fetchCalumaData") importData;
  @task
  *fetchCalumaData(model, importModelName) {
    assert(
      "Must set `importModelName` to a string.",
      typeof importModelName === "string"
    );
    assert(
      "Must set `instanceId` on model.",
      model.instanceId !== null && model.instanceId !== undefined
    );
    try {
      return yield this.dataImport[IMPORT_MAP[importModelName]](
        model.instanceId,
        ...args
      );
    } catch (error) {
      console.error(error);
      this.error = error;
      return error;
    }
  }
}
