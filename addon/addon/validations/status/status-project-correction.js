import {
  validatePresence,
  validateInclusion,
} from "ember-changeset-validations/validators";
import ConstructionProject from "ember-ebau-gwr/models/construction-project";
import validatePresenceState from "ember-ebau-gwr/validators/presence-state";

export default {
  projectStatus: [
    validatePresence({ presence: true }),
    validateInclusion({
      list: [
        ConstructionProject.STATUS_PROJECTED,
        ConstructionProject.STATUS_APPROVED,
        ConstructionProject.STATUS_CONSTRUCTION_STARTED,
        ConstructionProject.STATUS_COMPLETED,
        ConstructionProject.STATUS_SUSPENDED,
        ConstructionProject.STATUS_REFUSED,
        ConstructionProject.STATUS_NOT_REALIZED,
        ConstructionProject.STATUS_WITHDRAWN,
      ],
    }),
  ],
  projectAnnouncementDate: [
    validatePresence({
      presence: true,
    }),
  ],
  buildingPermitIssueDate: [
    validatePresenceState({
      presence: true,
      on: "projectStatus",
      states: [
        ConstructionProject.STATUS_APPROVED,
        ConstructionProject.STATUS_CONSTRUCTION_STARTED,
        ConstructionProject.STATUS_COMPLETED,
        ConstructionProject.STATUS_SUSPENDED,
      ],
    }),
    // TODO: currently leads to issues
    /*validatePresence({
            presence: true,
            on: ["projectStartDate", "durationOfConstructionPhase"],
          }),*/
  ],
  projectStartDate: [
    validatePresenceState({
      presence: true,
      on: "projectStatus",
      states: [
        ConstructionProject.STATUS_CONSTRUCTION_STARTED,
        ConstructionProject.STATUS_COMPLETED,
      ],
    }),
    // TODO: currently leads to issues
    /*validatePresence({
            presence: true,
            on: ["durationOfConstructionPhase"],
          }),*/
  ],
  durationOfConstructionPhase: [
    validatePresenceState({
      presence: true,
      on: "projectStatus",
      states: [
        ConstructionProject.STATUS_CONSTRUCTION_STARTED,
        ConstructionProject.STATUS_COMPLETED,
      ],
    }),
    // TODO: currently leads to issues
    /*validatePresence({
            presence: true,
            on: ["projectStartDate"],
          }),*/
  ],
  projectCompletionDate: [
    validatePresenceState({
      presence: true,
      on: "projectStatus",
      states: [ConstructionProject.STATUS_COMPLETED],
    }),
  ],
  projectSuspensionDate: [
    validatePresenceState({
      presence: true,
      on: "projectStatus",
      states: [ConstructionProject.STATUS_SUSPENDED],
    }),
  ],
  constructionAuthorisationDeniedDate: [
    validatePresenceState({
      presence: true,
      on: "projectStatus",
      states: [ConstructionProject.STATUS_REFUSED],
    }),
  ],
  cancellationDate: [
    validatePresenceState({
      presence: true,
      on: "projectStatus",
      states: [ConstructionProject.STATUS_NOT_REALIZED],
    }),
  ],
  withdrawalDate: [
    validatePresenceState({
      presence: true,
      on: "projectStatus",
      states: [ConstructionProject.STATUS_WITHDRAWN],
    }),
  ],
};
