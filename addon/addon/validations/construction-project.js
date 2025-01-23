import {
  validatePresence,
  validateLength,
  validateNumber,
  validateFormat,
} from "ember-changeset-validations/validators";

import realestateIdentification from "./realestate-identification";

export default {
  officialConstructionProjectFileNo: [
    validateFormat({
      regex: "^(s+[^0]|[^s0]).*$",
      allowBlank: true,
    }),
    validateLength({
      min: 1,
      max: 15,
      allowBlank: true,
    }),
  ],
  extensionOfOfficialConstructionProjectFileNo: validateNumber({
    integer: true,
    gte: 0,
    lte: 99,
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
    validateNumber({ lte: 999999999000 }),
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
      street: validateLength({ max: 60, allowBlank: true }),
      houseNumber: validateLength({ max: 12, allowBlank: true }),
      swissZipCode: [
        validateNumber({
          integer: true,
          gte: 1000,
          lte: 9699,
          allowBlank: true,
        }),
      ],
      swissZipCodeAddOn: [
        validateNumber({ integer: true, gte: 0, lte: 99, allowBlank: true }),
      ],
      foreignZipCode: validateNumber({
        integer: true,
        positive: true,
        allowBlank: true,
      }),
      addressLine2: validateLength({ max: 60, allowBlank: true }),
      country: {
        countryNameShort: [
          validatePresence({
            presence: true,
            on: [
              "client.identification.organisationIdentification.organisationName",
              "client.identification.personIdentification.officialName",
            ],
          }),
        ],
      },
    },
    identification: {
      organisationIdentification: {
        organisationName: validateLength({ max: 60, allowBlank: true }),
        organisationAdditionalName: validateLength({
          max: 60,
          allowBlank: true,
        }),
      },
      personIdentification: {
        officialName: [
          validatePresence({
            presence: true,
            on: "client.identification.personIdentification.firstName",
          }),
          validateLength({ max: 60, allowBlank: true }),
        ],
        firstName: [
          validatePresence({
            presence: true,
            on: "client.identification.personIdentification.officialName",
          }),
          validateLength({ max: 60, allowBlank: true }),
        ],
      },
    },
  },
  projectFreeText1: validateLength({ max: 32, allowBlank: true }),
  projectFreeText2: validateLength({ max: 32, allowBlank: true }),
  ...realestateIdentification,
};
