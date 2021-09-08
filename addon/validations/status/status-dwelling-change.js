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
      list: [
        Dwelling.STATUS_PROJECTED,
        Dwelling.STATUS_APPROVED,
        Dwelling.STATUS_CONSTRUCTION_STARTED,
        Dwelling.STATUS_COMPLETED,
        Dwelling.STATUS_UNUSABLE,
        Dwelling.STATUS_DEMOLISHED,
        Dwelling.STATUS_NOT_REALIZED,
        3009,
      ],
    }),
  ],
  yearOfConstruction: [
    validatePresenceTransition({
      presence: true,
      on: "dwellingStatus",
      transitions: ["setToCompletedDwelling"],
      data: Dwelling,
      model: "dwelling",
    }),
  ],

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
