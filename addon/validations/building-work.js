import {
  validatePresence,
  validateNumber,
  validateFormat,
} from "ember-changeset-validations/validators";

import { coordinatesValidation } from "./coordinates";

export default {
  kindOfWork: validatePresence(true),
  building: {
    buildingCategory: validatePresence(true),
    ...coordinatesValidation("building"),
    neighbourhood: validateNumber({ gte: 1000, allowBlank: true }),
    buildingStatus: validatePresence(true),
    yearOfDemolition: validateFormat({ regex: /^[0-9]{4}$/, allowBlank: true }),
  },
};
