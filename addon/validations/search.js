import { validatePresence } from "ember-changeset-validations/validators";

export default {
  realestateIdentification: {
    number: validatePresence({
      presence: true,
      on: [
        "realestateIdentification.EGRID",
        "realestateIdentification.numberSuffix",
        "realestateIdentification.subDistrict",
        "realestateIdentification.lot",
      ],
    }),
  },
  modifyDate: {
    dateTo: validatePresence({ presence: true, on: "modifyDate.dateFrom" }),
    dateFrom: validatePresence({ presence: true, on: "modifyDate.dateTo" }),
  },
  createDate: {
    dateTo: validatePresence({ presence: true, on: "createDate.dateFrom" }),
    dateFrom: validatePresence({ presence: true, on: "createDate.dateTo" }),
  },
};
