import {
  validatePresence,
  validateNumber,
  validateFormat,
} from "ember-changeset-validations/validators";
import { validatePresenceNested } from "ember-ebau-gwr/validators";

export default {
  kindOfWork: [validatePresence(true)],
  buildingCategory: [validatePresence(true)],
  coordinates: {
    north: [
      validatePresenceNested({ presence: true, on: "coordinates.east" }),
      validateNumber({ gte: 1070000.0, allowBlank: true }),
      validateNumber({ lte: 1300000.999, allowBlank: true }),
    ],
    east: [
      validatePresenceNested({ presence: true, on: "coordinates.north" }),
      validateNumber({ gte: 2480000.0, allowBlank: true }),
      validateNumber({ lte: 2840000.999, allowBlank: true }),
    ],
    originOfCoordinates: [validatePresence(true)],
  },
  neighbourhood: [validateNumber({ gte: 1000, allowBlank: true })],
  buildingStatus: [validatePresence(true)],
  yearOfDemolition: [validateFormat({ regex: /^[0-9]{4}$/ })],
};
