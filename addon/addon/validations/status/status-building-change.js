import {
  validatePresence,
  validateInclusion,
} from "ember-changeset-validations/validators";
import Building from "ember-ebau-gwr/models/building";
import validatePresenceTransition from "ember-ebau-gwr/validators/presence-transition";

export default {
  buildingStatus: [
    validatePresence({ presence: true }),
    validateInclusion({
      list: [
        Building.STATUS_PROJECTED,
        Building.STATUS_APPROVED,
        Building.STATUS_CONSTRUCTION_STARTED,
        Building.STATUS_COMPLETED,
        Building.STATUS_UNUSABLE,
        Building.STATUS_DEMOLISHED,
        Building.STATUS_NOT_REALIZED,
        1009,
      ],
    }),
  ],
  dateOfConstruction: {
    yearMonthDay: [
      validatePresenceTransition({
        presence: true,
        on: "buildingStatus",
        transitions: ["setToCompletedBuilding"],
        data: Building,
        model: "building",
      }),
    ],
  },
  yearOfDemolition: [
    validatePresenceTransition({
      presence: true,
      on: "buildingStatus",
      transitions: ["setToDemolishedBuilding"],
      data: Building,
      model: "building",
    }),
  ],
};
