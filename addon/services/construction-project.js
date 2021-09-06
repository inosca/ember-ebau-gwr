import { inject as service } from "@ember/service";
import { task, lastValue } from "ember-concurrency-decorators";
import Building from "ember-ebau-gwr/models/building";
import BuildingWork from "ember-ebau-gwr/models/building-work";
import ConstructionProject from "ember-ebau-gwr/models/construction-project";
import ConstructionProjectsList from "ember-ebau-gwr/models/construction-projects-list";
import Dwelling from "ember-ebau-gwr/models/dwelling";
import XMLModel from "ember-ebau-gwr/models/xml-model";

import GwrService from "./gwr";

export default class ConstructionProjectService extends GwrService {
  cacheKey = "EPROID";
  cacheClass = ConstructionProject;

  @service building;
  @service dwelling;

  async get(EPROID) {
    if (!EPROID) {
      return null;
    }
    const response = await this.authFetch.fetch(
      `/constructionprojects/${EPROID}`
    );
    const xml = await response.text();
    return this.createAndCache(xml);
  }

  async update(project) {
    const body = this.xml.buildXMLRequest("modifyConstructionProject", project);
    const response = await this.authFetch.fetch(
      `/constructionprojects/${project.EPROID}`,
      {
        method: "put",

        body,
      }
    );

    if (!response.ok) {
      const xmlErrors = await response.text();
      const errors = this.extractErrorsFromXML(xmlErrors);

      console.error("GWR API: modifyConstructionProject failed");
      throw errors;
    }

    const xml = await response.text();
    return this.createAndCache(xml);
  }

  async create(project) {
    const body = this.xml.buildXMLRequest("addConstructionProject", project);
    const response = await this.authFetch.fetch("/constructionprojects/", {
      method: "post",
      body,
    });

    if (!response.ok) {
      const xmlErrors = await response.text();
      const errors = this.extractErrorsFromXML(xmlErrors);

      console.error("GWR API: addConstructionProject failed");
      throw errors;
    }

    const xml = await response.text();
    return this.createAndCache(xml);
  }

  async deactivateDefaultWork(projectId) {
    return await this.removeWorkFromProject(projectId, 1);
  }

  async addDefaultWork(projectId) {
    const buildingWork = new BuildingWork();
    buildingWork.kindOfWork = 6002;
    buildingWork.ARBID = 1;
    return await this.addWorkToProject(projectId, buildingWork);
  }

  async addWorkToProject(projectId, buildingWork) {
    const body = this.xml.buildXMLRequest("addWorkToProject", buildingWork);
    const response = await this.authFetch.fetch(
      `/constructionprojects/${projectId}/work`,
      {
        method: "post",
        body,
      }
    );

    if (!response.ok) {
      const xmlErrors = await response.text();
      const errors = this.extractErrorsFromXML(xmlErrors);

      console.error("GWR API: addWorkToProject failed");
      throw errors;
    }

    const xml = await response.text();
    const model = new XMLModel(xml);
    const ARBID = model.getFieldFromXML(
      "ARBID",
      Number,
      "addWorkToProjectResponse"
    );

    buildingWork.ARBID = ARBID;

    // TODO: apply for type umbau with modifyWork, don't execute bindBuildingToConstructionProject
    return buildingWork;
    /*return buildingWork.kindOfWork === 6002
      ? await this.modifyWork(projectId, buildingWork)
      : buildingWork;*/
  }

  async modifyWork(projectId, buildingWork) {
    const body = this.xml.buildXMLRequest("modifyWork", buildingWork);
    const response = await this.authFetch.fetch(
      `/constructionprojects/${projectId}/work/${buildingWork.ARBID}`,
      {
        method: "put",
        body,
      }
    );

    if (!response.ok) {
      const xmlErrors = await response.text();
      const errors = this.extractErrorsFromXML(xmlErrors);

      console.error("GWR API: modifyWork failed");
      throw errors;
    }

    //const xml = await response.text();
    return buildingWork;
  }

  async removeWorkFromProject(projectId, workId) {
    const response = await this.authFetch.fetch(
      `/constructionprojects/${projectId}/work/${workId}`,
      {
        method: "delete",
      }
    );

    if (!response.ok) {
      const xmlErrors = await response.text();
      const errors = this.extractErrorsFromXML(xmlErrors);

      console.error("GWR API: deactivateWork failed");
      throw errors;
    }

    const xml = await response.text();
    return this.createAndCache(xml);
  }

  @lastValue("all") projects = [];
  @task
  *all(localId) {
    const links = yield this.store.query("gwr-link", {
      local_id: localId,
    });
    // We make a request for each project here but the probability
    // that there are a lot of linked projects is rather small so this
    // should be okay. Would be a future pain point if this requirement
    // would change.
    const projects = yield Promise.all(
      links.map(({ eproid }) => this.getFromCacheOrApi(eproid))
    );
    return projects;
  }

  async search(query = {}) {
    return super.search(query, query.EPROID, {
      xmlMethod: "getConstructionProject",
      urlPath: "constructionprojects",
      listModel: ConstructionProjectsList,
      listKey: "constructionProject",
      searchKey: "constructionProjectsList",
    });
  }

  nextValidStates(state) {
    return ConstructionProject.projectStatesMapping[state];
  }

  async setToApprovedConstructionProject(
    transition,
    cascadeLevel,
    isDryRun,
    project
  ) {
    // console.log("setToApprovedConstructionProject, checked");

    await Promise.all(
      project.work.map(async (buildingWork) => {
        if (buildingWork.kindOfWork === 6001) {
          if (
            [Building.STATUS_PROJECTED, Building.STATUS_APPROVED].includes(
              buildingWork.building.buildingStatus
            )
          ) {
            await this.building.setToApprovedBuilding(
              "setToApprovedBuilding",
              cascadeLevel - 1,
              isDryRun,
              buildingWork
            );
          } else {
            // Display message with link to dwelling with issue
            const states =
              cascadeLevel > 1
                ? [Building.STATUS_PROJECTED, Building.STATUS_APPROVED]
                : [Building.STATUS_APPROVED];

            throw {
              isLifeCycleError: true,
              buildingId: buildingWork.building.EGID,
              states,
            };
          }
        } else if (buildingWork.kindOfWork === 6002) {
          // console.log("setting dwellings of work:", buildingWork);
          await Promise.all(
            buildingWork.building.buildingEntrance.map(
              async (buildingEntrance) =>
                await Promise.all(
                  buildingEntrance.dwelling.map(async (dwelling) => {
                    if (
                      [
                        Dwelling.STATUS_PROJECTED,
                        Dwelling.STATUS_APPROVED,
                      ].includes(dwelling.dwellingStatus)
                    ) {
                      await this.dwelling.setToApprovedDwelling(
                        "setToApprovedDwelling",
                        cascadeLevel - 1,
                        isDryRun,
                        dwelling,
                        buildingWork.building.EGID
                      );
                    }
                  })
                )
            )
          );
        }
      })
    );

    if (
      !isDryRun &&
      cascadeLevel > 0 &&
      project !== ConstructionProject.STATUS_APPROVED
    ) {
      // console.log("transition setToApprovedConstructionProject");
      await this.transitionState(transition, project);
    }
  }

  async setToRefusedConstructionProject(
    transition,
    cascadeLevel,
    isDryRun,
    project
  ) {
    // console.log("setToRefusedConstructionProject, checked");
    await Promise.all(
      project.work.map(async (buildingWork) => {
        if (buildingWork.kindOfWork === 6001) {
          if (
            [
              Building.STATUS_PROJECTED,
              Building.STATUS_APPROVED,
              Building.STATUS_NOT_REALIZED,
            ].includes(buildingWork.building.buildingStatus)
          ) {
            await this.building.setToNotRealizedBuilding(
              "setToNotRealizedBuilding",
              cascadeLevel - 1,
              isDryRun,
              buildingWork
            );
          } else {
            // Display message with link to dwelling with issue
            const states =
              cascadeLevel > 1
                ? [
                    Building.STATUS_PROJECTED,
                    Building.STATUS_APPROVED,
                    Building.STATUS_NOT_REALIZED,
                  ]
                : [Building.STATUS_NOT_REALIZED];
            throw {
              isLifeCycleError: true,
              buildingId: buildingWork.building.EGID,
              states,
            };
          }
        } else if (buildingWork.kindOfWork === 6002) {
          await Promise.all(
            buildingWork.building.buildingEntrance.map(
              async (buildingEntrance) =>
                await Promise.all(
                  buildingEntrance.dwelling.map(async (dwelling) => {
                    if (
                      [
                        Dwelling.STATUS_PROJECTED,
                        Dwelling.STATUS_APPROVED,
                        Dwelling.STATUS_NOT_REALIZED,
                      ].includes(dwelling.dwellingStatus)
                    ) {
                      await this.dwelling.setToNotRealizedDwelling(
                        "setToNotRealizedDwelling",
                        cascadeLevel - 1,
                        isDryRun,
                        dwelling,
                        buildingWork.building.EGID
                      );
                    }
                  })
                )
            )
          );
        }
      })
    );

    if (
      !isDryRun &&
      cascadeLevel > 0 &&
      project !== ConstructionProject.STATUS_REFUSED
    ) {
      await this.transitionState(transition, project);
    }
  }

  async setToStartConstructionProject(
    transition,
    cascadeLevel,
    isDryRun,
    project
  ) {
    // console.log("setToStartConstructionProject, checked");
    if (
      !isDryRun &&
      cascadeLevel > 0 &&
      project !== ConstructionProject.STATUS_CONSTRUCTION_STARTED
    ) {
      await this.transitionState(transition, project);
    }
  }

  async setToCompletedConstructionProject(
    transition,
    cascadeLevel,
    isDryRun,
    project
  ) {
    await Promise.all(
      project.work.map(async (buildingWork) => {
        if (buildingWork.kindOfWork === 6001) {
          if (
            buildingWork.building.buildingStatus !== Building.STATUS_COMPLETED
          ) {
            throw {
              isLifeCycleError: true,
              buildingId: buildingWork.building.EGID,
              states: [Building.STATUS_COMPLETED],
            };
          }
        } else if (buildingWork.kindOfWork === 6007) {
          if (
            buildingWork.building.buildingStatus !== Building.STATUS_DEMOLISHED
          ) {
            throw {
              isLifeCycleError: true,
              buildingId: buildingWork.building.EGID,
              states: [Building.STATUS_DEMOLISHED],
            };
          }
        }

        await Promise.all(
          buildingWork.building.buildingEntrance.map(
            async (buildingEntrance) =>
              await Promise.all(
                buildingEntrance.dwelling.map(async (dwelling) => {
                  if (buildingWork.kindOfWork === 6001) {
                    if (dwelling.dwellingStatus !== Dwelling.STATUS_COMPLETED) {
                      throw {
                        isLifeCycleError: true,
                        dwellingId: dwelling.EWID,
                        buildingId: buildingWork.building.EGID,
                        states: [Dwelling.STATUS_COMPLETED],
                      };
                    }
                  } else if (buildingWork.kindOfWork === 6007) {
                    if (
                      dwelling.dwellingStatus !== Dwelling.STATUS_DEMOLISHED
                    ) {
                      throw {
                        isLifeCycleError: true,
                        dwellingId: dwelling.EWID,
                        buildingId: buildingWork.building.EGID,
                        states: [Dwelling.STATUS_DEMOLISHED],
                      };
                    }
                  }
                })
              )
          )
        );
      })
    );

    if (
      !isDryRun &&
      cascadeLevel > 0 &&
      project !== ConstructionProject.STATUS_COMPLETED
    ) {
      await this.transitionState(transition, project);
    }
  }

  async setToWithdrawnConstructionProject(
    transition,
    cascadeLevel,
    isDryRun,
    project
  ) {
    await Promise.all(
      project.work.map(async (buildingWork) => {
        if (buildingWork.kindOfWork === 6001) {
          if (
            [
              Building.STATUS_PROJECTED,
              Building.STATUS_APPROVED,
              Building.STATUS_NOT_REALIZED,
            ].includes(buildingWork.building.buildingStatus)
          ) {
            await this.building.setToNotRealizedBuilding(
              "setToNotRealizedBuilding",
              cascadeLevel - 1,
              isDryRun,
              buildingWork
            );
          } else {
            // Display message with link to dwelling with issue
            const states =
              cascadeLevel > 1
                ? [
                    Building.STATUS_PROJECTED,
                    Building.STATUS_APPROVED,
                    Building.STATUS_NOT_REALIZED,
                  ]
                : [Building.STATUS_NOT_REALIZED];
            throw {
              isLifeCycleError: true,
              buildingId: buildingWork.building.EGID,
              states,
            };
          }
        } else if (buildingWork.kindOfWork === 6002) {
          await Promise.all(
            buildingWork.building.buildingEntrance.map(
              async (buildingEntrance) =>
                await Promise.all(
                  buildingEntrance.dwelling.map(async (dwelling) => {
                    if (
                      [
                        Dwelling.STATUS_PROJECTED,
                        Dwelling.STATUS_APPROVED,
                        Dwelling.STATUS_NOT_REALIZED,
                      ].includes(dwelling.dwellingStatus)
                    ) {
                      await this.dwelling.setToNotRealizedDwelling(
                        "setToNotRealizedDwelling",
                        cascadeLevel - 1,
                        isDryRun,
                        dwelling,
                        buildingWork.building.EGID
                      );
                    } else {
                      // Display message with link to dwelling with issue
                      const states =
                        cascadeLevel > 1
                          ? [
                              Dwelling.STATUS_PROJECTED,
                              Dwelling.STATUS_APPROVED,
                              Dwelling.STATUS_NOT_REALIZED,
                            ]
                          : [Dwelling.STATUS_NOT_REALIZED];
                      throw {
                        isLifeCycleError: true,
                        dwellingId: dwelling.EWID,
                        buildingId: buildingWork.building.EGID,
                        states,
                      };
                    }
                  })
                )
            )
          );
        }
      })
    );

    if (
      !isDryRun &&
      cascadeLevel > 0 &&
      project !== ConstructionProject.STATUS_WITHDRAWN
    ) {
      await this.transitionState(transition, project);
    }
  }

  async setToCancelledConstructionProject(
    transition,
    cascadeLevel,
    isDryRun,
    project
  ) {
    await Promise.all(
      project.work.map(async (buildingWork) => {
        if (buildingWork.kindOfWork === 6001) {
          if (
            project.projectStatus ===
            ConstructionProject.STATUS_CONSTRUCTION_STARTED
          ) {
            // state is refused by api
            if (
              [
                Building.STATUS_CONSTRUCTION_STARTED,
                Building.STATUS_UNUSABLE,
              ].includes(buildingWork.building.buildingStatus)
            ) {
              await this.building.setToNotUsableBuilding(
                "setToNotUsableBuilding",
                cascadeLevel - 1,
                isDryRun,
                buildingWork
              );
            } else {
              // Display message with link to building with issue
              const states =
                cascadeLevel > 1
                  ? [
                      Building.STATUS_CONSTRUCTION_STARTED,
                      Building.STATUS_UNUSABLE,
                    ]
                  : [Building.STATUS_UNUSABLE];
              throw {
                isLifeCycleError: true,
                buildingId: buildingWork.building.EGID,
                states,
              };
            }
          } else {
            if (
              [
                Building.STATUS_PROJECTED,
                Building.STATUS_APPROVED,
                Building.STATUS_NOT_REALIZED,
              ].includes(buildingWork.building.buildingStatus)
            ) {
              await this.building.setToNotRealizedBuilding(
                "setToNotRealizedBuilding",
                cascadeLevel - 1,
                isDryRun,
                buildingWork
              );
            } else {
              // Display message with link to dwelling with issue
              const states =
                cascadeLevel > 1
                  ? [
                      Building.STATUS_PROJECTED,
                      Building.STATUS_APPROVED,
                      Building.STATUS_NOT_REALIZED,
                    ]
                  : [Building.STATUS_NOT_REALIZED];
              throw {
                isLifeCycleError: true,
                buildingId: buildingWork.building.EGID,
                states,
              };
            }
          }
        } else if (buildingWork.kindOfWork === 6002) {
          await Promise.all(
            buildingWork.building.buildingEntrance.map(
              async (buildingEntrance) =>
                await Promise.all(
                  buildingEntrance.dwelling.map(async (dwelling) => {
                    if (
                      [
                        Dwelling.STATUS_PROJECTED,
                        Dwelling.STATUS_APPROVED,
                        Dwelling.STATUS_NOT_REALIZED,
                      ].includes(dwelling.dwellingStatus)
                    ) {
                      await this.dwelling.setToNotRealizedDwelling(
                        "setToNotRealizedDwelling",
                        cascadeLevel - 1,
                        isDryRun,
                        dwelling,
                        buildingWork.building.EGID
                      );
                    } else {
                      // Display message with link to dwelling with issue
                      const states =
                        cascadeLevel > 1
                          ? [
                              Dwelling.STATUS_PROJECTED,
                              Dwelling.STATUS_APPROVED,
                              Dwelling.STATUS_NOT_REALIZED,
                            ]
                          : [Dwelling.STATUS_NOT_REALIZED];
                      throw {
                        isLifeCycleError: true,
                        dwellingId: dwelling.EWID,
                        buildingId: buildingWork.building.EGID,
                        states,
                      };
                    }
                  })
                )
            )
          );
        }
      })
    );

    if (
      !isDryRun &&
      cascadeLevel > 0 &&
      project !== ConstructionProject.STATUS_NOT_REALIZED
    ) {
      await this.transitionState(transition, project);
    }
  }

  async setToSuspendedConstructionProject(
    transition,
    cascadeLevel,
    isDryRun,
    project
  ) {
    if (
      !isDryRun &&
      cascadeLevel > 0 &&
      project !== ConstructionProject.STATUS_SUSPENDED
    ) {
      await this.transitionState(transition, project);
    }
  }

  async setToCancelledSuspensionConstructionProject(
    transition,
    cascadeLevel,
    isDryRun,
    project
  ) {
    if (
      !isDryRun &&
      cascadeLevel > 0 &&
      project === ConstructionProject.STATUS_SUSPENDED
    ) {
      await this.transitionState(transition, project);
    }
  }

  async transitionState(transition, project) {
    const body = this.xml.buildXMLRequest(transition, project);

    const response = await this.authFetch.fetch(
      `/constructionprojects/${project.EPROID}/${transition}`,
      {
        method: "put",
        body,
      }
    );

    if (!response.ok) {
      const xmlErrors = await response.text();
      const errors = this.extractErrorsFromXML(xmlErrors);

      console.error(`GWR API: ${transition} failed`);
      throw errors;
    }

    const xml = await response.text();
    return this.createAndCache(xml);
  }

  getChangeParameters(currentStatus, newStatus) {
    const transition =
      ConstructionProject.projectTransitionMapping[currentStatus][newStatus];

    const parameters =
      ConstructionProject.projectTransitionParameters[transition];
    return parameters;
  }

  getCorrectionParameters(newStatus) {
    return ConstructionProject.projectTransitionParametersMapping[newStatus];
  }

  correctStatus(project, newStatus) {
    const necessaryParameters = ConstructionProject.projectTransitionParametersMapping[
      newStatus
    ].map((param) => param.field);
    ConstructionProject.statusParameters.forEach((parameter) => {
      if (project[parameter] && !necessaryParameters.includes(parameter)) {
        project[parameter] = "9999-01-01";
      }
    });
  }

  getChangeHint(currentStatus, newStatus) {
    return ConstructionProject.projectTransitionHint[currentStatus][newStatus];
  }
}
