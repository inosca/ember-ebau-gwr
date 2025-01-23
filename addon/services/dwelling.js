import { guidFor } from "@ember/object/internals";
import { inject as service } from "@ember/service";
import Building from "ember-ebau-gwr/models/building";
import Dwelling, { DwellingComplete } from "ember-ebau-gwr/models/dwelling";

import GwrService from "./gwr";

export default class DwellingService extends GwrService {
  @service building;

  cacheKey(dwelling) {
    return `${guidFor(dwelling)}-${dwelling.EWID}`;
  }
  cacheClass = Dwelling;

  async get(EWID, EGID) {
    if ((!EWID && EWID !== 0) || !EGID) {
      return null;
    }
    const response = await this.authFetch.fetch(
      `/buildings/${EGID}/dwellings/${EWID}`,
    );
    const xml = await response.text();
    const dwellingComplete = new DwellingComplete(xml);
    this.cache(dwellingComplete.dwelling);

    dwellingComplete.dwelling.EDID = dwellingComplete.EDID;

    return dwellingComplete;
  }

  async update(dwelling, EGID) {
    const body = this.xml.buildXMLRequest(
      "modifyDwelling",
      dwelling,
      "Update dwelling",
    );
    const response = await this.authFetch.fetch(
      `/buildings/${EGID}/dwellings/${dwelling.EWID}`,
      {
        method: "put",
        body,
      },
    );

    if (!response.ok) {
      const xmlErrors = await response.text();
      const errors = this.extractErrorsFromXML(xmlErrors);

      console.error("GWR API: modifyDwelling failed");
      throw errors;
    }

    const xml = await response.text();
    return this.createAndCache(xml);
  }

  async reallocate(EGID, dwelling) {
    const body = this.xml.buildXMLRequest(
      "reallocateDwelling",
      { newEDID: dwelling.EDID, oldEDID: dwelling.oldEDID },
      "Reallocate dwelling",
    );
    const response = await this.authFetch.fetch(
      `/buildings/${EGID}/dwellings/${dwelling.EWID}/reallocate`,
      {
        method: "put",
        body,
      },
    );

    if (!response.ok) {
      const xmlErrors = await response.text();
      const errors = this.extractErrorsFromXML(xmlErrors);

      console.error("GWR API: reallocateDwelling failed");
      throw errors;
    }
  }

  async create(dwelling, EGID) {
    const body = this.xml.buildXMLRequest(
      "addDwelling",
      dwelling,
      "Add dwelling",
    );
    const response = await this.authFetch.fetch(
      `/buildings/${EGID}/entrance/${dwelling.EDID}/dwellings/work`,
      {
        method: "post",
        body,
      },
    );

    if (!response.ok) {
      const xmlErrors = await response.text();
      const errors = this.extractErrorsFromXML(xmlErrors);

      console.error("GWR API: addDwelling failed");
      throw errors;
    }

    // Refresh building cache after adding a dwelling

    await this.building.get(EGID);

    const xml = await response.text();
    return this.createAndCache(xml);
  }

  async deactivate(EGID, EWID) {
    const body = this.xml.buildXMLRequest(
      "deactivateDwelling",
      null,
      "Remove Dwelling",
    );
    const response = await this.authFetch.fetch(
      `/buildings/${EGID}/dwellings/${EWID}`,
      {
        method: "delete",
        body,
      },
    );
    if (!response.ok) {
      const xmlErrors = await response.text();
      const errors = this.extractErrorsFromXML(xmlErrors);

      console.error("GWR API: deactivateDwelling failed");
      throw errors;
    }
    // Refresh cache after removing the building

    await this.building.get(EGID);
  }

  nextValidStates(state) {
    return Dwelling.dwellingStatesMapping[state];
    // TODO allow same state repeated transitions:
    // return [...Dwelling.dwellingStatesMapping[state], state];
  }

  async setToApprovedDwelling(
    transition,
    cascadeLevel,
    isDryRun,
    dwelling,
    EGID,
  ) {
    if (
      !isDryRun &&
      cascadeLevel > 0 &&
      dwelling.dwellingStatus !== Dwelling.STATUS_APPROVED
    ) {
      await this.transitionState(transition, dwelling, EGID);
    } else if (
      !isDryRun &&
      dwelling.dwellingStatus !== Dwelling.STATUS_APPROVED
    ) {
      const building = await this.building.getFromCacheOrApi(EGID);
      throw {
        isLifeCycleError: true,
        dwellingId: dwelling.EWID,
        buildingId: building.EGID,
        states: [Dwelling.STATUS_APPROVED],
      };
    }
  }

  async setToDwellingConstructionStarted(
    transition,
    cascadeLevel,
    isDryRun,
    dwelling,
    EGID,
  ) {
    const building = await this.building.getFromCacheOrApi(EGID);
    if (
      ![
        Building.STATUS_CONSTRUCTION_STARTED,
        Building.STATUS_COMPLETED,
      ].includes(building.buildingStatus)
    ) {
      throw {
        isLifeCycleError: true,
        buildingId: building.EGID,
        states: [
          Building.STATUS_CONSTRUCTION_STARTED,
          Building.STATUS_COMPLETED,
        ],
      };
    }

    if (
      !isDryRun &&
      cascadeLevel > 0 &&
      dwelling.dwellingStatus !== Dwelling.STATUS_CONSTRUCTION_STARTED
    ) {
      await this.transitionState(transition, dwelling, EGID);
    } else if (
      !isDryRun &&
      dwelling.dwellingStatus !== Dwelling.STATUS_CONSTRUCTION_STARTED
    ) {
      throw {
        isLifeCycleError: true,
        dwellingId: dwelling.EWID,
        buildingId: building.EGID,
        states: [Dwelling.STATUS_APPROVED],
      };
    }
  }

  async setToCompletedDwelling(
    transition,
    cascadeLevel,
    isDryRun,
    dwelling,
    EGID,
  ) {
    if (
      !isDryRun &&
      cascadeLevel > 0 &&
      dwelling.dwellingStatus !== Dwelling.STATUS_COMPLETED
    ) {
      await this.transitionState(transition, dwelling, EGID);
    } else if (
      !isDryRun &&
      dwelling.dwellingStatus !== Dwelling.STATUS_COMPLETED
    ) {
      const building = await this.building.getFromCacheOrApi(EGID);
      throw {
        isLifeCycleError: true,
        dwellingId: dwelling.EWID,
        buildingId: building.EGID,
        states: [Dwelling.STATUS_COMPLETED],
      };
    }
  }

  async setToDemolishedDwelling(
    transition,
    cascadeLevel,
    isDryRun,
    dwelling,
    EGID,
  ) {
    const building = await this.building.getFromCacheOrApi(EGID);
    if (
      ![
        Building.STATUS_CONSTRUCTION_STARTED,
        Building.STATUS_COMPLETED,
      ].includes(building.buildingStatus)
    ) {
      throw {
        isLifeCycleError: true,
        buildingId: building.EGID,
        states: [
          Building.STATUS_CONSTRUCTION_STARTED,
          Building.STATUS_COMPLETED,
        ],
      };
    }

    if (
      !isDryRun &&
      cascadeLevel > 0 &&
      dwelling.dwellingStatus !== Dwelling.STATUS_DEMOLISHED
    ) {
      await this.transitionState(transition, dwelling, EGID);
    } else if (
      !isDryRun &&
      dwelling.dwellingStatus !== Dwelling.STATUS_DEMOLISHED
    ) {
      throw {
        isLifeCycleError: true,
        dwellingId: dwelling.EWID,
        buildingId: building.EGID,
        states: [Dwelling.STATUS_DEMOLISHED],
      };
    }
  }

  async setToNotRealizedDwelling(
    transition,
    cascadeLevel,
    isDryRun,
    dwelling,
    EGID,
  ) {
    const building = await this.building.getFromCacheOrApi(EGID);
    if (
      ![
        Building.STATUS_PROJECTED,
        Building.STATUS_APPROVED,
        Building.STATUS_COMPLETED,
        Building.STATUS_NOT_REALIZED,
      ].includes(building.buildingStatus)
    ) {
      throw {
        isLifeCycleError: true,
        buildingId: building.EGID,
        states: [
          Building.STATUS_PROJECTED,
          Building.STATUS_APPROVED,
          Building.STATUS_COMPLETED,
          Building.STATUS_NOT_REALIZED,
        ],
      };
    }

    if (
      !isDryRun &&
      cascadeLevel > 0 &&
      dwelling.dwellingStatus !== Dwelling.STATUS_NOT_REALIZED
    ) {
      await this.transitionState(transition, dwelling, EGID);
    } else if (
      !isDryRun &&
      dwelling.dwellingStatus !== Dwelling.STATUS_NOT_REALIZED
    ) {
      throw {
        isLifeCycleError: true,
        dwellingId: dwelling.EWID,
        buildingId: building.EGID,
        states: [Dwelling.STATUS_NOT_REALIZED],
      };
    }
  }

  async setToUnusableDwelling(
    transition,
    cascadeLevel,
    isDryRun,
    dwelling,
    EGID,
  ) {
    const building = await this.building.getFromCacheOrApi(EGID);
    if (
      ![
        Building.STATUS_CONSTRUCTION_STARTED,
        Building.STATUS_COMPLETED,
      ].includes(building.buildingStatus)
    ) {
      throw {
        isLifeCycleError: true,
        buildingId: building.EGID,
        states: [
          Building.STATUS_CONSTRUCTION_STARTED,
          Building.STATUS_COMPLETED,
        ],
      };
    }

    if (
      !isDryRun &&
      cascadeLevel > 0 &&
      dwelling.dwellingStatus !== Dwelling.STATUS_UNUSABLE
    ) {
      await this.transitionState(transition, dwelling, EGID);
    } else if (
      !isDryRun &&
      dwelling.dwellingStatus !== Dwelling.STATUS_UNUSABLE
    ) {
      throw {
        isLifeCycleError: true,
        dwellingId: dwelling.EWID,
        buildingId: building.EGID,
        states: [Dwelling.STATUS_UNUSABLE],
      };
    }
  }

  async transitionState(transition, dwelling, EGID) {
    const body = this.xml.buildXMLRequest(transition, dwelling);

    const response = await this.authFetch.fetch(
      `/buildings/${EGID}/dwellings/${dwelling.EWID}/${transition}`,
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

    // update cached dwelling
    // xml response from transition only contains partial information
    /* eslint-disable-next-line ember/classic-decorator-no-classic-methods */
    return this.get(dwelling.EWID, EGID);
  }

  getChangeParameters(currentStatus, newStatus) {
    const transition =
      Dwelling.dwellingTransitionMapping[currentStatus][newStatus];

    const parameters = Dwelling.dwellingTransitionParameters[transition];
    return parameters;
  }

  getCorrectionParameters(newStatus) {
    return Dwelling.dwellingTransitionParametersMapping[newStatus];
  }
}
