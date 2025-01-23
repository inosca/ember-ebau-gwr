import {
  validatePresence,
  validateInclusion,
} from "ember-changeset-validations/validators";
import Dwelling from "ember-ebau-gwr/models/dwelling";
import validatePresenceState from "ember-ebau-gwr/validators/presence-state";

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
    validatePresenceState({
      presence: true,
      on: "dwellingStatus",
      states: [Dwelling.STATUS_COMPLETED],
    }),
  ],
  yearOfDemolition: [
    validatePresenceState({
      presence: true,
      on: "dwellingStatus",
      states: [Dwelling.STATUS_DEMOLISHED],
    }),
  ],
};
