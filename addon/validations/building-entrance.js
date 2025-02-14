import {
  validateLength,
  validatePresence,
  validateNumber,
} from "ember-changeset-validations/validators";

export default {
  buildingEntranceNo: validateLength({ min: 1, max: 12, allowBlank: true }),
  locality: {
    swissZipCode: [
      validatePresence(true),
      validateNumber({ integer: true, gte: 1000, lte: 9699 }),
    ],
    name: {
      nameLong: validatePresence(true),
    },
  },
  street: {
    description: {
      descriptionLong: validatePresence(true),
    },
  },
};
