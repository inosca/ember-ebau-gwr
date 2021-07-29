import {
  validatePresence,
  validateInclusion,
} from "ember-changeset-validations/validators";
import validatePresenceState from "ember-ebau-gwr/validators/presence-state";

export default {
  dwellingStatus: [
    validatePresence({ presence: true }),
    validateInclusion({
      list: [3001, 3002, 3003, 3004, 3005, 3007, 3008, 3009],
    }),
  ],
  dateOfConstruction: {
    yearMonthDay: [
      validatePresenceState({
        presence: true,
        on: "dwellingStatus",
        states: [3004],
      }),
    ],
  },
  yearOfDemolition: [
    validatePresenceState({
      presence: true,
      on: "dwellingStatus",
      states: [3007],
    }),
  ],
};
