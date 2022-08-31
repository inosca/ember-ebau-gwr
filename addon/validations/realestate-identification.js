import {
  validateLength,
  validatePresence,
  validateNumber,
} from "ember-changeset-validations/validators";

export function realestateIdentificationValidation(path = "") {
  /*eslint-disable prefer-template*/
  const EGRIDPath = `${path && path + "."}realestateIdentification.EGRID`;
  const subDistrictPath = `${
    path && path + "."
  }realestateIdentification.subDistrict`;
  /*eslint-enable prefer-template*/

  return {
    realestateIdentification: {
      EGRID: validateLength({
        min: 1,
        max: 14,
        allowBlank: true,
      }),
      number: [
        validatePresence({
          presence: true,
          on: [EGRIDPath, subDistrictPath],
        }),
        validateLength({ min: 1, max: 12, allowBlank: true }),
      ],

      subDistrict: validateNumber({
        integer: true,
        gte: 0,
        lte: 9999,
        allowBlank: true,
      }),
    },
  };
}

export default realestateIdentificationValidation();
