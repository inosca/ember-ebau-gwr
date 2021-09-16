import {
  validatePresence,
  validateInclusion,
} from "ember-changeset-validations/validators";
import ConstructionProject from "ember-ebau-gwr/models/construction-project";
import validatePresenceTransition from "ember-ebau-gwr/validators/presence-transition";

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
    validatePresenceTransition({
      presence: true,
      on: "projectStatus",
      transitions: ["setToApprovedConstructionProject"],
      data: ConstructionProject,
      model: "project",
    }),
  ],
  constructionAuthorisationDeniedDate: [
    validatePresenceTransition({
      presence: true,
      on: "projectStatus",
      transitions: ["setToRefusedConstructionProject"],
      data: ConstructionProject,
      model: "project",
    }),
  ],
  cancellationDate: [
    validatePresenceTransition({
      presence: true,
      on: "projectStatus",
      transitions: ["setToCancelledConstructionProject"],
      data: ConstructionProject,
      model: "project",
    }),
  ],
  withdrawalDate: [
    validatePresenceTransition({
      presence: true,
      on: "projectStatus",
      transitions: ["setToWithdrawnConstructionProject"],
      data: ConstructionProject,
      model: "project",
    }),
  ],
  projectSuspensionDate: [
    validatePresenceTransition({
      presence: true,
      on: "projectStatus",
      transitions: ["setToSuspendedConstructionProject"],
      data: ConstructionProject,
      model: "project",
    }),
  ],
  projectStartDate: [
    validatePresenceTransition({
      presence: true,
      on: "projectStatus",
      transitions: ["setToStartConstructionProject"],
      data: ConstructionProject,
      model: "project",
    }),
  ],
  durationOfConstructionPhase: [
    validatePresenceTransition({
      presence: true,
      on: "projectStatus",
      transitions: ["setToStartConstructionProject"],
      data: ConstructionProject,
      model: "project",
    }),
  ],
  projectCompletionDate: [
    validatePresenceTransition({
      presence: true,
      on: "projectStatus",
      transitions: ["setToCompletedConstructionProject"],
      data: ConstructionProject,
      model: "project",
    }),
  ],
  realestateIdentification: {
    number: [
      validatePresenceTransition({
        presence: true,
        on: "projectStatus",
        transitions: ["setToCompletedConstructionProject"],
        data: ConstructionProject,
        model: "project",
      }),
    ],
  },
};
