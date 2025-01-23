import {
  validatePresence,
  validateInclusion,
} from "ember-changeset-validations/validators";
import Building from "ember-ebau-gwr/models/building";
import validatePresenceState from "ember-ebau-gwr/validators/presence-state";

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
      validatePresenceState({
        presence: true,
        on: "buildingStatus",
        states: [Building.STATUS_COMPLETED],
      }),
    ],
  },
  yearOfDemolition: [
    validatePresenceState({
      presence: true,
      on: "buildingStatus",
      states: [Building.STATUS_DEMOLISHED],
    }),
  ],
};
