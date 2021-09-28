import {
  validatePresence,
  validateLength,
  validateNumber,
} from "ember-changeset-validations/validators";

import realestateIdentification from "./realestate-identification";

export default {
  officialConstructionProjectFileNo: validateLength({
    min: 1,
    max: 15,
    allowBlank: true,
  }),
  extensionOfOfficialConstructionProjectFileNo: validateNumber({
    integer: true,
    allowBlank: true,
  }),
  typeOfConstructionProject: [
    validatePresence(true),
    validateNumber({ integer: true }),
  ],
  constructionProjectDescription: [
    validatePresence(true),
    validateLength({ min: 3, max: 1000 }),
  ],
  typeOfPermit: [validatePresence(true)],
  totalCostsOfProject: [
    validatePresence(true),
    validateNumber({ gte: 1000 }),
    validateNumber({ lte: 99999999900 }),
    validateNumber({ integer: true }),
  ],
  typeOfConstruction: [validatePresence(true)],
  projectAnnouncementDate: [validatePresence(true)],
  durationOfConstructionPhase: [
    validateNumber({
      gte: 1,
      lte: 999,
      integer: true,
      positive: true,
      allowBlank: true,
    }),
  ],
  typeOfClient: [validatePresence(true)],
  client: {
    address: {
      country: {
        countryNameShort: validatePresence({
          presence: true,
          on: [
            "client.identification.organisationIdentification.organisationName",
            "client.identification.personIdentification.officialName",
          ],
        }),
      },
    },
    identification: {
      personIdentification: {
        officialName: validatePresence({
          presence: true,
          on: "client.identification.personIdentification.firstName",
        }),
        firstName: validatePresence({
          presence: true,
          on: "client.identification.personIdentification.officialName",
        }),
      },
    },
  },
  ...realestateIdentification,
};
