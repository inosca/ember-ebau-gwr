import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { task, dropTask, lastValue } from "ember-concurrency-decorators";
import Options from "ember-ebau-gwr/models/options";
import ConstructionProjectValidations from "ember-ebau-gwr/validations/construction-project";

const PROJECTED = 6701,
  APPROVED = 6702;

export default class ProjectFormController extends Controller {
  queryParams = ["import"];
  ConstructionProjectValidations = ConstructionProjectValidations;

  @service constructionProject;
  @service building;
  @service dwelling;
  @service config;
  @service dataImport;
  @service store;
  @service router;
  @service intl;
  @service notification;

  @tracked import = false;
  @tracked isOrganisation;
  @tracked buildingWork;
  @tracked errors;

  choiceOptions = Options;

  get currentRoute() {
    return this.router.currentRouteName;
  }

  get nextValidStates() {
    const states = this.constructionProject.nextValidStates(
      this.project.projectStatus
    );
    return states;
  }

  @lastValue("fetchProject") project;
  @task
  *fetchProject() {
    const project = this.model.project?.isNew
      ? this.model.project
      : yield this.constructionProject.getFromCacheOrApi(this.model.projectId);
    this.isOrganisation = project.client.identification.isOrganisation;
    this.buildingWork = project.work.filter((work) => !work.building.isNew);

    this.errors = [];
    return project;
  }

  @lastValue("fetchCalumaData") importData;
  @task
  *fetchCalumaData() {
    return yield this.dataImport.fetchProject(this.model.instanceId);
  }

  @action
  cancelMerge() {
    this.import = false;
    this.fetchProject.perform();
  }

  @dropTask
  *saveProject() {
    try {
      if (this.project.isNew) {
        console.log("saveProject");
        const project = yield this.constructionProject.create(this.project);
        const link = this.store.createRecord("gwr-link", {
          eproid: project.EPROID,
          localId: this.model.instanceId,
        });
        yield link.save();
        // Reload the overview table to display the new project
        yield this.constructionProject.all.perform(this.model.instanceId);
        this.transitionToRoute("project.form", project.EPROID);
      } else {
        yield this.constructionProject.update(this.project);
      }
      this.import = false;
      this.errors = [];
      this.notification.success(
        this.intl.t("ember-gwr.constructionProject.saveSuccess")
      );
    } catch (error) {
      this.errors = error;
      this.notification.danger(
        this.intl.t("ember-gwr.constructionProject.saveError")
      );
    }
  }

  // TODO: reduce code duplication, maybe combine with cascade
  async check(currentStatus, newStatus) {
    if (newStatus === 6704) {
      if ((await Promise.all(this.buildingWork.map(async (buildingWork) => {
        if (buildingWork.kindOfWork === 6001) {
          const building = await this.building.get(buildingWork.building.EGID);
          return (building.buildingStatus !== 1004 ||
            building.buildingEntrance
              .map((entrance) => entrance.dwelling)
              .flat()
              .some((dwelling) => dwelling.dwellingStatus !== 3004)
          )
        } 
        return false;
      }))).some(Boolean)) {
          return "Wohnungen und Gebäude in Neubauprojekten müssen auf " +
                  "bestehend gesetzt werden bevor das Bauprojekt abgeschlossen werden kann.";
      }
    } else if (newStatus === 6708) {
      if ((await Promise.all(this.buildingWork.map(async (buildingWork) => {
        if (buildingWork.kindOfWork === 6001) {
          const building = await this.building.get(buildingWork.building.EGID);
          if (this.project.projectStatus === 6703) {
            return (building.buildingStatus !== 1005 ||
              building.buildingEntrance
                .map((entrance) => entrance.dwelling)
                .flat()
                .some((dwelling) => dwelling.dwellingStatus !== 3005)
            )
          } else {
            return (building.buildingStatus !== 1008 ||
              building.buildingEntrance
                .map((entrance) => entrance.dwelling)
                .flat()
                .some((dwelling) => dwelling.dwellingStatus !== 3008)
            )
          }
        } else if (buildingWork.kindOfWork === 6002) {
          return building.buildingEntrance
            .map((entrance) => entrance.dwelling)
            .flat()
            .some((dwelling) => dwelling.dwellingStatus !== 3008)
        }
        return false;
      }))).some(Boolean)) {
          return "Wohnungen und Gebäude müssen auf nicht realisiert bzw. nicht " + 
            "nutzbar gesetzt werden bevor das Bauprojekt auf nicht realisiert gesetzt werden kann.";
      }
    } else if (newStatus === 6707 || newStatus === 6709) {
      if ((await Promise.all(this.buildingWork.map(async (buildingWork) => {
        if (buildingWork.kindOfWork === 6001) {
          const building = await this.building.get(buildingWork.building.EGID);
          return (building.buildingStatus !== 1008 ||
            building.buildingEntrance
              .map((entrance) => entrance.dwelling)
              .flat()
              .some((dwelling) => dwelling.dwellingStatus !== 3008)
          )
        } else if (buildingWork.kindOfWork === 6002) {
          return building.buildingEntrance
            .map((entrance) => entrance.dwelling)
            .flat()
            .some((dwelling) => dwelling.dwellingStatus !== 3008)
        }
        return false;
      }))).some(Boolean)) {
        return "Wohnungen und Gebäude müssen auf nicht realisiert " + 
          "gesetzt werden bevor das Bauprojekt auf nicht realisiert oder abgelehnt gesetzt werden kann.";
      }
    }
    
    return [];
  }

  cascadeStates(buildingWork, currentStatus, newStatus) {
    if (currentStatus === PROJECTED && newStatus === APPROVED) {
      return {
        building: {
          currentStatus: [1001],
          newStatus: 1002,
        },
        dwelling: {
          currentStatus: [3001],
          newStatus: 3002,
        },
      };
    } else if (newStatus === 6708) {
      if (buildingWork.kindOfWork === 6001) {
        return this.project.projectStatus === 6703
          ? {
              building: {
                currentStatus: [1003],
                newStatus: 1005,
              },
              dwelling: {
                currentStatus: [3001],
                newStatus: 3005,
              },
            }
          : {
              building: {
                currentStatus: [1001, 1002],
                newStatus: 1008,
              },
              dwelling: {
                currentStatus: [3001, 3002, 3003],
                newStatus: 3008,
              },
            };
      }

      if (buildingWork.kindOfWork === 6002) {
        return {
          dwelling: {
            currentStatus: [3001, 3002],
            newStatus: 3008,
          },
        };
      }
    } else if (newStatus === 6707 || newStatus === 6709) {
      if (buildingWork.kindOfWork === 6001) {
        return {
          building: {
            currentStatus: [1001, 1002],
            newStatus: 1008,
          },
          dwelling: {
            currentStatus: [3001, 3002, 3003],
            newStatus: 3008,
          },
        };
      }

      if (buildingWork.kindOfWork === 6002) {
        return {
          dwelling: {
            currentStatus: [3001, 3002],
            newStatus: 3008,
          },
        };
      }
    }

    return undefined;
  }

  @task
  *cascadeTransition(currentStatus, newStatus) {
    yield Promise.all(
      this.buildingWork.map(async (buildingWork) => {
        const cascadeStates = this.cascadeStates(
          buildingWork,
          currentStatus,
          newStatus
        );
        if (cascadeStates?.dwelling) {
          console.log("cascading dwellings");
          await Promise.all(
            buildingWork.building.buildingEntrance.map(async (entrance) => {
              await Promise.all(
                entrance.dwelling.map(async (dwelling) => {
                  if (
                    dwelling.dwellingStatus !==
                      cascadeStates.dwelling.newStatus &&
                    cascadeStates.dwelling.currentStatus.includes(
                      dwelling.dwellingStatus
                    )
                  ) {
                    console.log("settings dwelling:", dwelling);
                    await this.dwelling.transitionState(
                      dwelling,
                      dwelling.dwellingStatus,
                      cascadeStates.dwelling.newStatus,
                      buildingWork.building.EGID
                    );
                  }
                })
              );
            })
          );
        }
        if (cascadeStates?.building) {
          if (
            buildingWork.building.buildingStatus !==
              cascadeStates.building.newStatus &&
            cascadeStates.building.currentStatus.includes(
              buildingWork.building.buildingStatus
            )
          ) {
            console.log("setting building:", buildingWork.building);
            await this.building.transitionState(
              buildingWork.building,
              buildingWork.building.buildingStatus,
              cascadeStates.building.newStatus
            );
          }
        }
      })
    );
  }

  @task
  *transitionState(currentStatus, newStatus) {
    try {
      yield this.cascadeTransition.perform(currentStatus, newStatus);
      const errors = this.check(currentStatus, newStatus);
      if (errors.length) {
        throw errors;
      }

      console.log("setting project");
      yield this.constructionProject.transitionState(
        this.project,
        currentStatus,
        newStatus
      );
      yield this.constructionProject.clearCache(this.model.projectId);
      this.fetchProject.perform(); // reload for errors;
      this.notification.success(
        this.intl.t("ember-gwr.constructionProject.saveSuccess")
      );
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t("ember-gwr.constructionProject.saveError")
      );
      throw error;
    }
  }

  @action
  getChangeParameters(currentStatus, newStatus) {
    return this.constructionProject.getChangeParameters(
      currentStatus,
      newStatus
    );
  }

  @task
  *correctState(newStatus) {
    try {
      this.constructionProject.correctStatus(this.project, newStatus);
      yield this.constructionProject.update(this.project);
      yield this.constructionProject.clearCache(this.model.projectId);
      this.fetchProject.perform(); // reload for errors;
      this.notification.success(
        this.intl.t("ember-gwr.constructionProject.saveSuccess")
      );
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t("ember-gwr.constructionProject.saveError")
      );
      throw error;
    }
  }
  @action
  getCorrectionParameters(newStatus) {
    return this.constructionProject.getCorrectionParameters(newStatus);
  }

  @action
  getChangeHint(currentStatus, newStatus) {
    return this.constructionProject.getChangeHint(currentStatus, newStatus);
  }
}
