import {
  validateLength,
  validatePresence,
} from "ember-changeset-validations/validators";

export function realestateIdentificationValidation(path = "") {
  /*eslint-disable prefer-template*/
  const EGRIDPath = `${path && path + "."}realestateIdentification.EGRID`;
  const numberSuffixPath = `${
    path && path + "."
  }realestateIdentification.numberSuffix`;
  const subDistrictPath = `${
    path && path + "."
  }realestateIdentification.subDistrict`;
  const lotPath = `${path && path + "."}realestateIdentification.lot`;
  /*eslint-enable prefer-template*/

  return {
    realestateIdentification: {
      EGRID: validateLength({
        min: 1,
        max: 12,
        allowBlank: true,
      }),
      number: [
        validatePresence({
          presence: true,
          on: [EGRIDPath, numberSuffixPath, subDistrictPath, lotPath],
        }),
        validateLength({ min: 1, max: 12, allowBlank: true }),
      ],
      numberSuffix: validateLength({ min: 1, max: 12, allowBlank: true }),
      subDistrict: validateLength({ min: 1, max: 12, allowBlank: true }),
      lot: validateLength({ min: 1, max: 12, allowBlank: true }),
    },
  };
}

export default realestateIdentificationValidation();
