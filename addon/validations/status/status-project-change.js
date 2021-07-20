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
      list: [6701, 6702, 6703, 6704, 6706, 6707, 6708, 6709],
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
  nonRealisationDate: [
    validatePresenceTransition({
      presence: true,
      on: "projectStatus",
      transitions: ["setToWithdrawnConstructionProject"],
      data: ConstructionProject,
      model: "project",
    }),
  ],
  withdrawalDate: [
    validatePresenceTransition({
      presence: true,
      on: "projectStatus",
      transitions: ["setToCancelledConstructionProject"],
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
};
