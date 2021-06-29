import {
  validatePresence,
  validateLength,
  validateNumber,
} from "ember-changeset-validations/validators";

export default {
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
  projectAnnouncementDate: [validatePresence(true)],
  typeOfClient: [validatePresence(true)],
  client: {
    identification: {
      organisationIdentification: {
        localOrganisationId: {
          organisationIdCategory: [validateLength({ max: 20 })],
          organisationId: [validateLength({ min: 1, max: 36 })],
        },
      },
    },
  },
};
