import {
  validatePresence,
  validateNumber,
  validateLength,
  validateDate,
} from "ember-changeset-validations/validators";

import buildingEntranceValidation from "./building-entrance";
import { coordinatesValidation } from "./coordinates";
import realestateIdentification from "./realestate-identification";

export function buildingWorkValidation({
  isNew = false,
  validateOnlyBuilding = false,
} = {}) {
  const building = {
    officialBuildingNo: [
      validateNumber({ integer: true, positive: true, allowBlank: true }),
      validateLength({ max: 12, allowBlank: true }),
    ],
    nameOfBuilding: validateLength({ min: 3, max: 40, allowBlank: true }),
    buildingCategory: validatePresence(true),
    ...coordinatesValidation("building"),
    localCode1: validateLength({ max: 8, allowBlank: true }),
    localCode2: validateLength({ max: 8, allowBlank: true }),
    localCode3: validateLength({ max: 8, allowBlank: true }),
    localCode4: validateLength({ max: 8, allowBlank: true }),
    neighbourhood: validateNumber({ gte: 1000, allowBlank: true }),
    buildingStatus: validatePresence(true),
    dateOfConstruction: {
      yearMonthDay: [
        validateDate({
          onOrAfter: new Date("1000-01-01"),
          message: "{description} must be on or after {onOrAfter}",
          allowBlank: true,
        }),
        validateDate({
          onOrBefore: new Date(),
          message: "{description} must be on or before {onOrBefore}",
          allowBlank: true,
        }),
      ],
    },
    yearOfDemolition: [
      validateNumber({
        integer: true,
        gte: 1999,
        lte: new Date().getFullYear(),
        allowBlank: true,
      }),
    ],
    surfaceAreaOfBuilding: validateNumber({
      integer: true,
      gte: 1,
      lte: 99999,
      allowBlank: true,
    }),
    volume: {
      volume: validateNumber({
        integer: true,
        gte: 5,
        lte: 3000000,
        allowBlank: true,
      }),
      informationSource: validatePresence({
        presence: true,
        on: "building.volume.volume",
      }),
      norm: validatePresence({
        presence: true,
        on: "building.volume.volume",
      }),
    },
    numberOfFloors: validateNumber({
      integer: true,
      gte: 1,
      lte: 99,
      allowBlank: true,
    }),
    numberOfSeparateHabitableRooms: validateNumber({
      integer: true,
      gte: 0,
      lte: 999,
      allowBlank: true,
    }),
    energyRelevantSurface: validateNumber({
      integer: true,
      gte: 5,
      lte: 900000,
      allowBlank: true,
    }),
    thermotechnicalDeviceForHeating1: {
      revisionDate: validateDate({
        onOrAfter: new Date("2000-12-31"),
        message: "{description} must be on or after {onOrAfter}",
        allowBlank: true,
      }),
    },
    thermotechnicalDeviceForHeating2: {
      revisionDate: validateDate({
        onOrAfter: new Date("2000-12-31"),
        message: "{description} must be on or after {onOrAfter}",
        allowBlank: true,
      }),
    },
    thermotechnicalDeviceForWarmWater1: {
      revisionDate: validateDate({
        onOrAfter: new Date("2000-12-31"),
        message: "{description} must be on or after {onOrAfter}",
        allowBlank: true,
      }),
    },
    thermotechnicalDeviceForWarmWater2: {
      revisionDate: validateDate({
        onOrAfter: new Date("2000-12-31"),
        message: "{description} must be on or after {onOrAfter}",
        allowBlank: true,
      }),
    },
    buildingFreeText1: validateLength({ max: 32, allowBlank: true }),
    buildingFreeText2: validateLength({ max: 32, allowBlank: true }),
    ...realestateIdentification,
  };
  const validations = {
    kindOfWork: validatePresence(true),
    building,
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

  if (validateOnlyBuilding) {
    return { building };
  } else if (isNew) {
    return validationsNew;
  }
  return validations;
}

export default buildingWorkValidation();
