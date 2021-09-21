import {
  validatePresence,
  validateNumber,
  validateFormat,
} from "ember-changeset-validations/validators";

import buildingEntranceValidation from "./building-entrance";
import { coordinatesValidation } from "./coordinates";

export function buildingWorkValidation(isNew = false) {
  const validations = {
    kindOfWork: validatePresence(true),
    building: {
      buildingCategory: validatePresence(true),
      ...coordinatesValidation("building"),
      neighbourhood: validateNumber({ gte: 1000, allowBlank: true }),
      buildingStatus: validatePresence(true),
      yearOfDemolition: validateFormat({
        regex: /^[0-9]{4}$/,
        allowBlank: true,
      }),
    },
  };

  const validationsNew = {
    ...validations,
    building: {
      ...validations.building,
      buildingEntrance: {
        ...buildingEntranceValidation,
      },
    },
  };

  return isNew ? validationsNew : validations;
}

export default buildingWorkValidation();
