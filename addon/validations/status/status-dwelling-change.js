import {
  validatePresence,
  validateInclusion,
} from "ember-changeset-validations/validators";
import Dwelling from "ember-ebau-gwr/models/dwelling";
import validatePresenceTransition from "ember-ebau-gwr/validators/presence-transition";

export default {
  dwellingStatus: [
    validatePresence({ presence: true }),
    validateInclusion({
      list: [3001, 3002, 3003, 3004, 3005, 3007, 3008, 3009],
    }),
  ],
  dateOfConstruction: {
    yearMonthDay: [
      validatePresenceTransition({
        presence: true,
        on: "dwellingStatus",
        transitions: ["setToCompletedDwelling"],
        data: Dwelling,
        model: "dwelling",
      }),
    ],
  },
  yearOfDemolition: [
    validatePresenceTransition({
      presence: true,
      on: "dwellingStatus",
      transitions: ["setToDemolishedDwelling"],
      data: Dwelling,
      model: "dwelling",
    }),
  ],
};
