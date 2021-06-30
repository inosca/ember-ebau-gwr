import {
  validatePresence,
  validateNumber,
  validateLength,
} from "ember-changeset-validations/validators";

export default {
  floor: [validatePresence(true), validateNumber({ gte: 3100 })],
  multipleFloor: validatePresence(true),
  dwellingStatus: validatePresence(true),
  noOfHabitableRooms: validateNumber({ gte: 1, allowBlank: true }),
  locationOfDwellingOnFloor: validateLength({ min: 3, allowBlank: true }),
  surfaceAreaOfDwelling: validateNumber({ lt: 9999, allowBlank: true }),
  dwellingFreeText1: validateLength({ min: 1, allowBlank: true }),
  dwellingFreeText2: validateLength({ min: 1, allowBlank: true }),
};
