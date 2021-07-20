import {
  validatePresence,
  validateInclusion,
} from "ember-changeset-validations/validators";
import validatePresenceState from "ember-ebau-gwr/validators/presence-state";

export default {
  buildingStatus: [
    validatePresence({ presence: true }),
    validateInclusion({
      list: [1001, 1002, 1003, 1004, 1005, 1007, 1008, 1009],
    }),
  ],
  dateOfConstruction: {
    yearMonthDay: [
      validatePresenceState({
        presence: true,
        on: "buildingStatus",
        states: [1004],
      }),
    ],
  },
  yearOfDemolition: [
    validatePresenceState({
      presence: true,
      on: "buildingStatus",
      states: [1007],
    }),
  ],
};
