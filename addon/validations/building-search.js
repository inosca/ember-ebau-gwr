import { validatePresence } from "ember-changeset-validations/validators";

import { realestateIdentificationValidation } from "./realestate-identification";

export default {
  realestateIdentification: {
    number: validatePresence({
      presence: true,
      on: [
        "realestateIdentification.EGRID",
        "realestateIdentification.subDistrict",
      ],
    }),
    EGRID: realestateIdentificationValidation(),
  },
};
