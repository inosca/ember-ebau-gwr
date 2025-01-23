import {
  validatePresence,
  validateNumber,
  validateLength,
  validateDate,
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
  administrativeDwellingNo: validateLength({ max: 12, allowBlank: true }),
  physicalDwellingNo: validateLength({ max: 12, allowBlank: true }),
  floorType: validatePresence(true),
  floorNumber: [
    validatePresenceState({
      presence: true,
      on: "floorType",
      states: [3101, 3401],
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
  noOfHabitableRooms: validateNumber({
    integer: true,
    gte: 1,
    lte: 99,
    allowBlank: true,
  }),
  locationOfDwellingOnFloor: validateLength({
    min: 3,
    max: 40,
    allowBlank: true,
  }),
  surfaceAreaOfDwelling: validateNumber({
    integer: true,
    gte: 1,
    lte: 9999,
    allowBlank: true,
  }),
  dwellingFreeText1: validateLength({ min: 1, max: 32, allowBlank: true }),
  dwellingFreeText2: validateLength({ min: 1, max: 32, allowBlank: true }),
  dwellingUsage: {
    informationSource: validatePresence({
      presence: true,
      on: "dwellingUsage.usageCode",
    }),
    revisionDate: [
      validateDate({
        onOrAfter: new Date("2012-12-31"),
        message: "{description} must be on or after {onOrAfter}",
        allowBlank: true,
      }),
      validateDate({
        onOrBefore: new Date(),
        message: "{description} must be on or before {onOrBefore}",
        allowBlank: true,
      }),
    ],
    remark: validateLength({ max: 512, allowBlank: true }),
  },
};
