import {
  validatePresence,
  validateInclusion,
} from "ember-changeset-validations/validators";
import validatePresenceState from "ember-ebau-gwr/validators/presence-state";

export default {
  projectStatus: [
    validatePresence({ presence: true }),
    validateInclusion({
      list: [6701, 6702, 6703, 6704, 6706, 6707, 6708, 6709],
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
      states: [6702, 6703, 6704, 6706],
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
      states: [6703, 6704],
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
      states: [6703, 6704],
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
      states: [6704],
    }),
  ],
  projectSuspensionDate: [
    validatePresenceState({
      presence: true,
      on: "projectStatus",
      states: [6706],
    }),
  ],
  constructionAuthorisationDeniedDate: [
    validatePresenceState({
      presence: true,
      on: "projectStatus",
      states: [6707],
    }),
  ],
  nonRealisationDate: [
    validatePresenceState({
      presence: true,
      on: "projectStatus",
      states: [6708],
    }),
  ],
  withdrawalDate: [
    validatePresenceState({
      presence: true,
      on: "projectStatus",
      states: [6709],
    }),
  ],
};
