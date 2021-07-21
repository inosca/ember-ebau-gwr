import { validateNumber } from "ember-changeset-validations/validators";
import { validatePresenceNested } from "ember-ebau-gwr/validators/presence-nested";

export function coordinatesValidation(path = "") {
  /*eslint-disable prefer-template*/
  const eastPath = `${path && path + "."}coordinates.east`;
  const northPath = `${path && path + "."}coordinates.north`;
  const originPath = `${path && path + "."}coordinates.originOfCoordinates`;
  /*eslint-enable prefer-template*/

  return {
    coordinates: {
      north: [
        validatePresenceNested({
          presence: true,
          on: [eastPath, originPath],
        }),
        validateNumber({ gte: 1070000.0, allowBlank: true }),
        validateNumber({ lte: 1300000.999, allowBlank: true }),
      ],
      east: [
        validatePresenceNested({ presence: true, on: [northPath, originPath] }),
        validateNumber({ gte: 2480000.0, allowBlank: true }),
        validateNumber({ lte: 2840000.999, allowBlank: true }),
      ],
      originOfCoordinates: [
        validatePresenceNested({
          presence: true,
          on: [eastPath, northPath],
        }),
      ],
    },
  };
}
export default coordinatesValidation();
