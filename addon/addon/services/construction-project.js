import { inject as service } from "@ember/service";
import { task, lastValue } from "ember-concurrency";
import Building from "ember-ebau-gwr/models/building";
import ConstructionProject from "ember-ebau-gwr/models/construction-project";
import ConstructionProjectsList from "ember-ebau-gwr/models/construction-projects-list";
import Dwelling from "ember-ebau-gwr/models/dwelling";
import XMLModel from "ember-ebau-gwr/models/xml-model";

import GwrService from "./gwr";

export default class ConstructionProjectService extends GwrService {
  cacheKey = "EPROID";
  cacheClass = ConstructionProject;
  ConstructionProject = ConstructionProject;

  @service building;
  @service dwelling;
  @service store;

  async get(EPROID) {
    if (!EPROID) {
      return null;
    }
    const response = await this.authFetch.fetch(
      `/constructionprojects/${EPROID}`,
    );
    const xml = await response.text();
    const project = this.createAndCache(xml);

    // Archived GWR projects aren't removed from the stored instance links, but
    // can no longer be fetched through the API. Those projects are therefore
    // ignored, might be better to properly remove the associated links in the
    // future.
    if (!project.EPROID) {
      return null;
    }

    return project;
  }

  async update(project) {
    const body = this.xml.buildXMLRequest("modifyConstructionProject", project);
    const response = await this.authFetch.fetch(
      `/constructionprojects/${project.EPROID}`,
      {
        method: "put",

        body,
      },
    );

    if (!response.ok) {
      const xmlErrors = await response.text();
      const errors = this.extractErrorsFromXML(xmlErrors);

      console.error("GWR API: modifyConstructionProject failed");
      throw errors;
    }

    const xml = await response.text();
    // TODO: does modifyConstructionProjectResponse return all information?
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

  async addWorkToProject(projectId, buildingWork) {
    const body = this.xml.buildXMLRequest("addWorkToProject", buildingWork);
    const response = await this.authFetch.fetch(
      `/constructionprojects/${projectId}/work`,
      {
        method: "post",
        body,
      },
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
      "addWorkToProjectResponse",
    );

    buildingWork.ARBID = ARBID;
    buildingWork.isNew = false;
    return buildingWork;
  }

  async modifyWork(projectId, buildingWork) {
    const body = this.xml.buildXMLRequest("modifyWork", buildingWork);
    const response = await this.authFetch.fetch(
      `/constructionprojects/${projectId}/work/${buildingWork.ARBID}`,
      {
        method: "put",
        body,
      },
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
      },
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
      links.map(({ eproid }) => this.getFromCacheOrApi(eproid)),
    );

    // Remove no longer available projects
    return projects.filter(Boolean);
  }

  async removeProjectLink(projectId) {
    const link = this.store
      .peekAll("gwr-link")
      .find(({ eproid }) => Number(eproid) === projectId);
    await link.destroyRecord();
    this.all.lastSuccessful.value = this.all.lastSuccessful.value.filter(
      (project) => project.EPROID !== projectId,
    );
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
    // TODO allow same state repeated transitions:
    // return [...ConstructionProject.projectStatesMapping[state], state];
  }

  async setToApprovedConstructionProject(
    transition,
    cascadeLevel,
    isDryRun,
    project,
  ) {
    await Promise.all(
      project.work.map(async (buildingWork) => {
        // don't execute checks for work without building
        if (buildingWork.building.isNew) {
          return;
        }

        if (buildingWork.kindOfWork === 6001) {
          if (
            [Building.STATUS_PROJECTED, Building.STATUS_APPROVED].includes(
              buildingWork.building.buildingStatus,
            )
          ) {
            await this.building.setToApprovedBuilding(
              "setToApprovedBuilding",
              cascadeLevel - 1,
              isDryRun,
              buildingWork,
            );
          } else {
            // Display message with link to building with issue
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
          await Promise.all(
            buildingWork.building.buildingEntrance.map((buildingEntrance) =>
              Promise.all(
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
                      buildingWork.building.EGID,
                    );
                  }
                }),
              ),
            ),
          );
        }
      }),
    );

    if (
      !isDryRun &&
      cascadeLevel > 0 &&
      project.projectStatus !== ConstructionProject.STATUS_APPROVED
    ) {
      // ensure state transitions have been performed by api
      /* eslint-disable-next-line ember/classic-decorator-no-classic-methods */
      await this.get(project.EPROID);
      await this.transitionState(transition, project);
    }
  }

  async setToRefusedConstructionProject(
    transition,
    cascadeLevel,
    isDryRun,
    project,
  ) {
    await Promise.all(
      project.work.map(async (buildingWork) => {
        // don't execute checks for work without building
        if (buildingWork.building.isNew) {
          return;
        }

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
              buildingWork,
            );
          } else {
            // Display message with link to building with issue
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
            buildingWork.building.buildingEntrance.map((buildingEntrance) =>
              Promise.all(
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
                      buildingWork.building.EGID,
                    );
                  }
                }),
              ),
            ),
          );
        }
      }),
    );

    if (
      !isDryRun &&
      cascadeLevel > 0 &&
      project.projectStatus !== ConstructionProject.STATUS_REFUSED
    ) {
      // ensure state transitions have been performed by api
      /* eslint-disable-next-line ember/classic-decorator-no-classic-methods */
      await this.get(project.EPROID);
      await this.transitionState(transition, project);
    }
  }

  async setToStartConstructionProject(
    transition,
    cascadeLevel,
    isDryRun,
    project,
  ) {
    if (
      !isDryRun &&
      cascadeLevel > 0 &&
      project.projectStatus !== ConstructionProject.STATUS_CONSTRUCTION_STARTED
    ) {
      // ensure state transitions have been performed by api
      /* eslint-disable-next-line ember/classic-decorator-no-classic-methods */
      await this.get(project.EPROID);
      await this.transitionState(transition, project);
    }
  }

  async setToCompletedConstructionProject(
    transition,
    cascadeLevel,
    isDryRun,
    project,
  ) {
    /** TODO: throws error for any kind of project (Tiefbau / Hochbau)
     *<ns2:errorList>
     *  <ns2:ruleID>CQ4782</ns2:ruleID>
     *  <ns2:ruleCategory>BAU</ns2:ruleCategory>
     *  <ns2:action>Refused</ns2:action>
     *  <ns2:messageOfError>Für Tiefbauprojekte sind keine Gebäude und Wohnungen zugelassen. Bitte korrigieren.</ns2:messageOfError>
     *</ns2:errorList>
     **/
    await Promise.all(
      project.work.map(async (buildingWork) => {
        // don't execute checks for work without building
        if (buildingWork.building.isNew) {
          return;
        }

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
          buildingWork.building.buildingEntrance.map((buildingEntrance) =>
            Promise.all(
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
                  if (dwelling.dwellingStatus !== Dwelling.STATUS_DEMOLISHED) {
                    throw {
                      isLifeCycleError: true,
                      dwellingId: dwelling.EWID,
                      buildingId: buildingWork.building.EGID,
                      states: [Dwelling.STATUS_DEMOLISHED],
                    };
                  }
                }
              }),
            ),
          ),
        );
      }),
    );

    if (
      !isDryRun &&
      cascadeLevel > 0 &&
      project.projectStatus !== ConstructionProject.STATUS_COMPLETED
    ) {
      // ensure state transitions have been performed by api
      /* eslint-disable-next-line ember/classic-decorator-no-classic-methods */
      await this.get(project.EPROID);
      await this.transitionState(transition, project);
    }
  }

  async setToWithdrawnConstructionProject(
    transition,
    cascadeLevel,
    isDryRun,
    project,
  ) {
    await Promise.all(
      project.work.map(async (buildingWork) => {
        // don't execute checks for work without building
        if (buildingWork.building.isNew) {
          return;
        }

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
              buildingWork,
            );
          } else {
            // Display message with link to building with issue
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
            buildingWork.building.buildingEntrance.map((buildingEntrance) =>
              Promise.all(
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
                      buildingWork.building.EGID,
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
                }),
              ),
            ),
          );
        }
      }),
    );

    if (
      !isDryRun &&
      cascadeLevel > 0 &&
      project.projectStatus !== ConstructionProject.STATUS_WITHDRAWN
    ) {
      // ensure state transitions have been performed by api
      /* eslint-disable-next-line ember/classic-decorator-no-classic-methods */
      await this.get(project.EPROID);
      await this.transitionState(transition, project);
    }
  }

  async setToCancelledConstructionProject(
    transition,
    cascadeLevel,
    isDryRun,
    project,
  ) {
    await Promise.all(
      project.work.map(async (buildingWork) => {
        // don't execute checks for work without building
        if (buildingWork.building.isNew) {
          return;
        }

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
                buildingWork,
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
                buildingWork,
              );
            } else {
              // Display message with link to building with issue
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
            buildingWork.building.buildingEntrance.map((buildingEntrance) =>
              Promise.all(
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
                      buildingWork.building.EGID,
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
                }),
              ),
            ),
          );
        }
      }),
    );

    if (
      !isDryRun &&
      cascadeLevel > 0 &&
      project.projectStatus !== ConstructionProject.STATUS_NOT_REALIZED
    ) {
      // ensure state transitions have been performed by api
      /* eslint-disable-next-line ember/classic-decorator-no-classic-methods */
      await this.get(project.EPROID);
      await this.transitionState(transition, project);
    }
  }

  async setToSuspendedConstructionProject(
    transition,
    cascadeLevel,
    isDryRun,
    project,
  ) {
    if (
      !isDryRun &&
      cascadeLevel > 0 &&
      project.projectStatus !== ConstructionProject.STATUS_SUSPENDED
    ) {
      // ensure state transitions have been performed by api
      /* eslint-disable-next-line ember/classic-decorator-no-classic-methods */
      await this.get(project.EPROID);
      await this.transitionState(transition, project);
    }
  }

  async setToCancelledSuspensionConstructionProject(
    transition,
    cascadeLevel,
    isDryRun,
    project,
  ) {
    if (
      !isDryRun &&
      cascadeLevel > 0 &&
      project.projectStatus === ConstructionProject.STATUS_SUSPENDED
    ) {
      // ensure state transitions have been performed by api
      /* eslint-disable-next-line ember/classic-decorator-no-classic-methods */
      await this.get(project.EPROID);
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
      },
    );

    if (!response.ok) {
      const xmlErrors = await response.text();
      const errors = this.extractErrorsFromXML(xmlErrors, [
        {
          errorKey: this.ConstructionProject.MISSING_BUILDING_ERROR,
          errorMessage: this.intl.t(
            "ember-gwr.constructionProject.missingBuildingError",
          ),
        },
      ]);

      console.error(`GWR API: ${transition} failed`);
      throw errors;
    }

    // update cached project
    // xml response from transition only contains partial information
    /* eslint-disable-next-line ember/classic-decorator-no-classic-methods */
    return this.get(project.EPROID);
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
    const necessaryParameters =
      ConstructionProject.projectTransitionParametersMapping[newStatus].map(
        (param) => param.field,
      );
    ConstructionProject.statusParameters.forEach((parameter) => {
      if (project[parameter] && !necessaryParameters.includes(parameter)) {
        project[parameter] = "9999-01-01";
      }
    });
  }
}
