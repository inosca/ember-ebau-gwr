import {
  validatePresence,
  validateNumber,
} from "ember-changeset-validations/validators";

import { realestateIdentificationValidation } from "./realestate-identification";

export default {
  EPROID: validateNumber({
    integer: true,
    gte: 1,
    lte: 900000000,
    allowBlank: true,
  }),
  EGID: validateNumber({
    integer: true,
    gte: 1,
    lte: 900000000,
    allowBlank: true,
  }),
  ...realestateIdentificationValidation(),
  createDate: {
    dateTo: validatePresence({
      presence: true,
      on: ["createDate.dateFrom"],
    }),
    dateFrom: validatePresence({
      presence: true,
      on: ["createDate.dateTo"],
    }),
  },
  modifyDate: {
    dateTo: validatePresence({
      presence: true,
      on: ["modifyDate.dateFrom"],
    }),
    dateFrom: validatePresence({
      presence: true,
      on: ["modifyDate.dateFrom"],
    }),
  },
};
