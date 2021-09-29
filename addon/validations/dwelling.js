import {
  validatePresence,
  validateNumber,
  validateLength,
} from "ember-changeset-validations/validators";
import validatePresenceState from "ember-ebau-gwr/validators/presence-state";
import validateRangeState from "ember-ebau-gwr/validators/range-state";

const yearValidation = {
  allowBlank: true,
  integer: true,
  positive: true,
  gte: 1999,
  lte: new Date().getFullYear(),
};

export default {
  floorType: validatePresence(true),
  floorNumber: [
    validatePresenceState({
      presence: true,
      on: "floorType",
      states: [3101, 3401],
    }),
    validatePresenceState({
      presence: false,
      on: "floorType",
      states: [3100],
    }),
    validateRangeState({
      range: [1, 99],
      on: "floorType",
      states: [3101],
    }),
    validateRangeState({
      range: [1, 19],
      on: "floorType",
      states: [3401],
    }),
  ],
  yearOfConstruction: validateNumber(yearValidation),
  yearOfDemolition: validateNumber(yearValidation),
  multipleFloor: validatePresence(true),
  dwellingStatus: validatePresence(true),
  noOfHabitableRooms: validateNumber({ gte: 1, allowBlank: true }),
  locationOfDwellingOnFloor: validateLength({ min: 3, allowBlank: true }),
  surfaceAreaOfDwelling: validateNumber({ lt: 9999, allowBlank: true }),
  dwellingFreeText1: validateLength({ min: 1, allowBlank: true }),
  dwellingFreeText2: validateLength({ min: 1, allowBlank: true }),
};
