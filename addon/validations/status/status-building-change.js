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
      list: [1001, 1002, 1003, 1004, 1005, 1007, 1008, 1009],
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
