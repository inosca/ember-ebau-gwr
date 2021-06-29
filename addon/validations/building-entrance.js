import {
  validateLength,
  validatePresence,
} from "ember-changeset-validations/validators";

import CoordinatesValidation from "./coordinates";

export default {
  buildingEntranceNo: validateLength({ min: 1, max: 12, allowBlank: true }),
  locality: {
    name: {
      nameLong: validatePresence(true),
    },
  },
  ...CoordinatesValidation,
};
