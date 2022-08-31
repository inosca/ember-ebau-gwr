import { validatePresence } from "ember-changeset-validations/validators";

import { realestateIdentificationValidation } from "./realestate-identification";

export default {
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
