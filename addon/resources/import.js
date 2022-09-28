import { assert } from "@ember/debug";
import { registerDestructor } from "@ember/destroyable";
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

export const NO_DATA_ERROR = Symbol("no-data");

export default class ImportResource extends Resource {
  @service dataImport;
  @service router;

  @tracked error = null;

  constructor(owner) {
    super(owner);

    registerDestructor(this, () => {
      this.fetchCalumaData.cancelAll({ resetState: true });
    });
  }

  get isLoading() {
    return this.fetchCalumaData.isRunning;
  }

  get hasError() {
    return Boolean(this.error);
  }

  modify(_positional, named) {
    this.fetchCalumaData.perform(named);
  }

  @lastValue("fetchCalumaData") value;
  @task
  *fetchCalumaData({ instanceId, showImport, importModelName }) {
    if (instanceId && showImport) {
      assert(
        "Must set `importModelName` to a string.",
        typeof importModelName === "string"
      );
      assert(
        "Must set `instanceId`.",
        instanceId !== null && instanceId !== undefined
      );
      try {
        const data = yield this.dataImport[IMPORT_MAP[importModelName]](
          instanceId
        );
        if (Object.keys(data).length === 0 || data.length === 0) {
          this.router.externalRouter.transitionTo({
            queryParams: { import: false },
          });
          this.error = NO_DATA_ERROR;
        } else {
          this.error = null;
          return data?.length === 1 ? data[0] : data;
        }
      } catch (error) {
        console.error(error);
        this.error = error;
        return null;
      }
    } else {
      return null;
    }
  }
}
