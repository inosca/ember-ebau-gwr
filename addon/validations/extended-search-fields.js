import { validatePresence } from "ember-changeset-validations/validators";

export default {
  realestateIdentification: {
    number: validatePresence({
      presence: true,
      on: [
        "realestateIdentification.EGRID",
        "realestateIdentification.subDistrict",
      ],
    }),
  },
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
