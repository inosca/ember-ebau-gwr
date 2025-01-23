import { inject as service } from "@ember/service";
import Building from "ember-ebau-gwr/models/building";
import BuildingEntrance from "ember-ebau-gwr/models/building-entrance";
import BuildingsList from "ember-ebau-gwr/models/buildings-list";
import Dwelling from "ember-ebau-gwr/models/dwelling";

import GwrService from "./gwr";

export default class BuildingService extends GwrService {
  BuildingEntrance = BuildingEntrance;

  @service constructionProject;
  @service dwelling;

  cacheKey = "EGID";
  cacheClass = Building;

  async unbindBuildingFromConstructionProject(EPROID, EGID) {
    const response = await this.authFetch.fetch(
      `/buildings/${EGID}/unbindToConstructionProject/${EPROID}`,
      {
        method: "put",
      },
    );
    if (!response.ok) {
      const xmlErrors = await response.text();
      const errors = this.extractErrorsFromXML(xmlErrors);

      console.error("GWR API: unbindBuildingFromConstructionProject failed");
      throw errors;
    }
    // Refresh cache after removing the building

    await this.constructionProject.get(EPROID);
  }

  async bindBuildingToConstructionProject(EPROID, EGID, buildingWork) {
    const body = this.xml.buildXMLRequest("bindBuildingToConstructionProject", {
      EPROID,
      EGID,
      buildingWork,
    });
    const response = await this.authFetch.fetch(
      `/buildings/${EGID}/bindToConstructionProject`,
      {
        method: "put",
        body,
      },
    );
    if (!response.ok) {
      const xmlErrors = await response.text();
      const errors = this.extractErrorsFromXML(xmlErrors);

      console.error("GWR API: bindBuildingToConstructionProject failed");
      throw errors;
    }
    // Update cache

    this.constructionProject.get(EPROID);

    const xml = await response.text();
    return this.createAndCache(xml);
  }

  async update(building) {
    const body = this.xml.buildXMLRequest("modifyBuilding", building);
    const response = await this.authFetch.fetch(`/buildings/${building.EGID}`, {
      method: "put",

      body,
    });

    if (!response.ok) {
      const xmlErrors = await response.text();
      const errors = this.extractErrorsFromXML(xmlErrors, [
        {
          errorKey: Building.FORBIDDEN_BUILDING_CLASS_ERROR,
          errorMessage: this.intl.t(
            "ember-gwr.building.forbiddenBuildingClassError",
          ),
        },
      ]);

      console.error("GWR API: modifyBuilding failed");
      throw errors;
    }

    const xml = await response.text();
    return this.createAndCache(xml);
  }

  async create(EPROID, buildingWork) {
    const work = await this.constructionProject.addWorkToProject(
      EPROID,
      buildingWork,
    );
    const body = this.xml.buildXMLRequest(
      "addBuildingToConstructionProject",
      work.building,
    );
    const response = await this.authFetch.fetch(
      `/constructionprojects/${EPROID}/work/${work.ARBID}`,
      {
        method: "post",
        body,
      },
    );

    if (!response.ok) {
      const xmlErrors = await response.text();
      const errors = this.extractErrorsFromXML(xmlErrors, [
        {
          errorKey: Building.FORBIDDEN_BUILDING_CLASS_ERROR,

          errorMessage: this.intl.t(
            "ember-gwr.building.forbiddenBuildingClassError",
          ),
        },

        {
          errorKey: this.BuildingEntrance.LOCALITY_ERROR,
          errorMessage: this.intl.t(
            "ember-gwr.building.buildingEntrance.localityError",
            {
              htmlSafe: true,
            },
          ),
        },
      ]);

      await this.constructionProject.removeWorkFromProject(EPROID, work.ARBID);

      buildingWork.ARBID = undefined;
      buildingWork.isNew = true;
      console.error("GWR API: addBuildingToConstructionProject failed");
      throw errors;
    }

    const xml = await response.text();
    return this.createAndCache(xml);
  }

  async get(EGID) {
    if (!EGID) {
      return null;
    }
    const response = await this.authFetch.fetch(`/buildings/${EGID}`);
    const xml = await response.text();
    return this.createAndCache(xml);
  }

  async search(query = {}) {
    return super.search(query, query.EGID, {
      xmlMethod: "getBuilding",
      urlPath: "buildings",
      listModel: BuildingsList,
      listKey: "building",
      searchKey: "buildingsList",
    });
  }

  nextValidStates(state) {
    return Building.buildingStatesMapping[state];
    // TODO: allow same state repeated transitions:
    // return [...Building.buildingStatesMapping[state], state];
  }

  async setToApprovedBuilding(
    transition,
    cascadeLevel,
    isDryRun,
    buildingWork,
  ) {
    await Promise.all(
      buildingWork.building.buildingEntrance.map((buildingEntrance) =>
        Promise.all(
          buildingEntrance.dwelling.map(async (dwelling) => {
            if (
              [Dwelling.STATUS_PROJECTED, Dwelling.STATUS_APPROVED].includes(
                dwelling.dwellingStatus,
              )
            ) {
              await this.dwelling.setToApprovedDwelling(
                "setToApprovedDwelling",
                cascadeLevel - 1,
                isDryRun,
                dwelling,
                buildingWork.building.EGID,
              );
            } else {
              // Display message with link to dwelling with issue
              const states =
                cascadeLevel > 1
                  ? [Dwelling.STATUS_PROJECTED, Dwelling.STATUS_APPROVED]
                  : [Dwelling.STATUS_APPROVED];
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

    if (
      !isDryRun &&
      cascadeLevel > 0 &&
      buildingWork.building.buildingStatus !== Building.STATUS_APPROVED
    ) {
      // ensure state transitions have been performed by api
      /* eslint-disable-next-line ember/classic-decorator-no-classic-methods */
      await this.get(buildingWork.building.EGID);
      await this.transitionState(transition, buildingWork.building);
    } else if (
      !isDryRun &&
      buildingWork.building.buildingStatus !== Building.STATUS_APPROVED
    ) {
      throw {
        isLifeCycleError: true,
        buildingId: buildingWork.building.EGID,
        states: [Building.STATUS_APPROVED],
      };
    }
  }

  async setToBuildingConstructionStarted(
    transition,
    cascadeLevel,
    isDryRun,
    buildingWork,
  ) {
    await Promise.all(
      buildingWork.building.buildingEntrance.map((buildingEntrance) =>
        Promise.all(
          buildingEntrance.dwelling.map(async (dwelling) => {
            if (
              ![
                Dwelling.STATUS_APPROVED,
                Dwelling.STATUS_CONSTRUCTION_STARTED,
              ].includes(dwelling.dwellingStatus)
            ) {
              // Display message with link to dwelling with issue
              throw {
                isLifeCycleError: true,
                dwellingId: dwelling.EWID,
                buildingId: buildingWork.building.EGID,
                states: [
                  Dwelling.STATUS_APPROVED,
                  Dwelling.STATUS_CONSTRUCTION_STARTED,
                ],
              };
            }
          }),
        ),
      ),
    );

    if (
      !isDryRun &&
      cascadeLevel > 0 &&
      buildingWork.building.buildingStatus !==
        Building.STATUS_CONSTRUCTION_STARTED
    ) {
      // ensure state transitions have been performed by api
      /* eslint-disable-next-line ember/classic-decorator-no-classic-methods */
      await this.get(buildingWork.building.EGID);
      await this.transitionState(transition, buildingWork.building);
    } else if (
      !isDryRun &&
      buildingWork.building.buildingStatus !==
        Building.STATUS_CONSTRUCTION_STARTED
    ) {
      throw {
        isLifeCycleError: true,
        buildingId: buildingWork.building.EGID,
        states: [Building.STATUS_CONSTRUCTION_STARTED],
      };
    }
  }

  async setToCompletedBuilding(
    transition,
    cascadeLevel,
    isDryRun,
    buildingWork,
  ) {
    await Promise.all(
      buildingWork.building.buildingEntrance.map((buildingEntrance) =>
        Promise.all(
          buildingEntrance.dwelling.map(async (dwelling) => {
            if (
              ![
                Dwelling.STATUS_APPROVED,
                Dwelling.STATUS_CONSTRUCTION_STARTED,
                Dwelling.STATUS_COMPLETED,
              ].includes(dwelling.dwellingStatus)
            ) {
              // Display message with link to dwelling with issue
              throw {
                isLifeCycleError: true,
                dwellingId: dwelling.EWID,
                buildingId: buildingWork.building.EGID,
                states: [
                  Dwelling.STATUS_APPROVED,
                  Dwelling.STATUS_CONSTRUCTION_STARTED,
                  Dwelling.STATUS_COMPLETED,
                ],
              };
            }
          }),
        ),
      ),
    );

    if (
      !isDryRun &&
      cascadeLevel > 0 &&
      buildingWork.building.buildingStatus !== Building.STATUS_COMPLETED
    ) {
      // ensure state transitions have been performed by api
      /* eslint-disable-next-line ember/classic-decorator-no-classic-methods */
      await this.get(buildingWork.building.EGID);
      await this.transitionState(transition, buildingWork.building);
    } else if (
      !isDryRun &&
      buildingWork.building.buildingStatus !== Building.STATUS_COMPLETED
    ) {
      throw {
        isLifeCycleError: true,
        buildingId: buildingWork.building.EGID,
        states: [Building.STATUS_COMPLETED],
      };
    }
  }

  async setToDemolishedBuilding(
    transition,
    cascadeLevel,
    isDryRun,
    buildingWork,
  ) {
    await Promise.all(
      buildingWork.building.buildingEntrance.map((buildingEntrance) =>
        Promise.all(
          buildingEntrance.dwelling.map(async (dwelling) => {
            if (
              [
                Dwelling.STATUS_COMPLETED,
                Dwelling.STATUS_UNUSABLE,
                Dwelling.STATUS_DEMOLISHED,
              ].includes(dwelling.dwellingStatus)
            ) {
              if (dwelling.dwellingStatus !== Dwelling.STATUS_DEMOLISHED) {
                dwelling.yearOfDemolition =
                  buildingWork.building.yearOfDemolition;
              }
              await this.dwelling.setToDemolishedDwelling(
                "setToDemolishedDwelling",
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
                      Dwelling.STATUS_COMPLETED,
                      Dwelling.STATUS_UNUSABLE,
                      Dwelling.STATUS_DEMOLISHED,
                    ]
                  : [Dwelling.STATUS_DEMOLISHED];
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

    if (
      !isDryRun &&
      cascadeLevel > 0 &&
      buildingWork.building.buildingStatus !== Building.STATUS_DEMOLISHED
    ) {
      // ensure state transitions have been performed by api
      /* eslint-disable-next-line ember/classic-decorator-no-classic-methods */
      await this.get(buildingWork.building.EGID);
      await this.transitionState(transition, buildingWork.building);
    } else if (
      !isDryRun &&
      buildingWork.building.buildingStatus !== Building.STATUS_DEMOLISHED
    ) {
      throw {
        isLifeCycleError: true,
        buildingId: buildingWork.building.EGID,
        states: [Building.STATUS_DEMOLISHED],
      };
    }
  }

  async setToNotRealizedBuilding(
    transition,
    cascadeLevel,
    isDryRun,
    buildingWork,
  ) {
    await Promise.all(
      buildingWork.building.buildingEntrance.map((buildingEntrance) =>
        Promise.all(
          buildingEntrance.dwelling.map(async (dwelling) => {
            if (
              [
                Dwelling.STATUS_PROJECTED,
                Dwelling.STATUS_APPROVED,
                Dwelling.STATUS_CONSTRUCTION_STARTED,
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
                      Dwelling.STATUS_CONSTRUCTION_STARTED,
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

    if (
      !isDryRun &&
      cascadeLevel > 0 &&
      buildingWork.building.buildingStatus !== Building.STATUS_NOT_REALIZED
    ) {
      // ensure state transitions have been performed by api
      /* eslint-disable-next-line ember/classic-decorator-no-classic-methods */
      await this.get(buildingWork.building.EGID);
      await this.transitionState(transition, buildingWork.building);
    } else if (
      !isDryRun &&
      buildingWork.building.buildingStatus !== Building.STATUS_NOT_REALIZED
    ) {
      throw {
        isLifeCycleError: true,
        buildingId: buildingWork.building.EGID,
        states: [Building.STATUS_NOT_REALIZED],
      };
    }
  }

  async setToUnusableBuilding(
    transition,
    cascadeLevel,
    isDryRun,
    buildingWork,
  ) {
    await Promise.all(
      buildingWork.building.buildingEntrance.map((buildingEntrance) =>
        Promise.all(
          buildingEntrance.dwelling.map(async (dwelling) => {
            if (
              [
                Dwelling.STATUS_CONSTRUCTION_STARTED,
                Dwelling.STATUS_UNUSABLE,
              ].includes(dwelling.dwellingStatus)
            ) {
              await this.dwelling.setToUnusableDwelling(
                "setToUnusableDwelling",
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
                      Dwelling.STATUS_CONSTRUCTION_STARTED,
                      Dwelling.STATUS_UNUSABLE,
                    ]
                  : [Dwelling.STATUS_UNUSABLE];
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

    if (
      !isDryRun &&
      cascadeLevel > 0 &&
      buildingWork.building.buildingStatus !== Building.STATUS_UNUSABLE
    ) {
      // ensure state transitions have been performed by api
      /* eslint-disable-next-line ember/classic-decorator-no-classic-methods */
      await this.get(buildingWork.building.EGID);
      await this.transitionState(transition, buildingWork.building);
    } else if (
      !isDryRun &&
      buildingWork.building.buildingStatus !== Building.STATUS_UNUSABLE
    ) {
      throw {
        isLifeCycleError: true,
        buildingId: buildingWork.building.EGID,
        states: [Building.STATUS_UNUSABLE],
      };
    }
  }

  async transitionState(transition, building) {
    const body = this.xml.buildXMLRequest(transition, building);

    const response = await this.authFetch.fetch(
      `/buildings/${building.EGID}/${transition}`,
      {
        method: "put",
        body,
      },
    );

    if (!response.ok) {
      const xmlErrors = await response.text();
      const errors = this.extractErrorsFromXML(xmlErrors);

      console.error(`GWR API: ${transition} failed`);
      throw errors;
    }

    // update cached building
    // xml response from transition only contains partial information
    /* eslint-disable-next-line ember/classic-decorator-no-classic-methods */
    return this.get(building.EGID);
  }

  getChangeParameters(currentStatus, newStatus) {
    const transition =
      Building.buildingTransitionMapping[currentStatus][newStatus];

    const parameters = Building.buildingTransitionParameters[transition];
    return parameters;
  }

  getCorrectionParameters(newStatus) {
    return Building.buildingTransitionParametersMapping[newStatus];
  }
}
