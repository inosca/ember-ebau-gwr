import {
  validatePresence,
  validateNumber,
  validateFormat,
} from "ember-changeset-validations/validators";
import { validatePresenceNested } from "ember-ebau-gwr/validators/presence-nested";

export default {
  kindOfWork: validatePresence(true),
  building: {
    buildingCategory: validatePresence(true),
    coordinates: {
      north: [
        validatePresenceNested({
          presence: true,
          on: "building.coordinates.east",
        }),
        validateNumber({ gte: 1070000.0, allowBlank: true }),
        validateNumber({ lte: 1300000.999, allowBlank: true }),
      ],
      east: [
        validatePresenceNested({
          presence: true,
          on: "building.coordinates.north",
        }),
        validateNumber({ gte: 2480000.0, allowBlank: true }),
        validateNumber({ lte: 2840000.999, allowBlank: true }),
      ],
      originOfCoordinates: validatePresenceNested({
        presence: true,
        on: ["building.coordinates.north", "building.coordinates.east"],
      }),
    },
    neighbourhood: validateNumber({ gte: 1000, allowBlank: true }),
    buildingStatus: validatePresence(true),
    yearOfDemolition: validateFormat({ regex: /^[0-9]{4}$/, allowBlank: true }),
  },
};
