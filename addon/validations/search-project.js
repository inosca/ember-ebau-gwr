import { validateNumber } from "ember-changeset-validations/validators";

export default {
  EPROID: validateNumber({
    integer: true,
    gte: 1,
    lte: 900000000,
    allowBlank: true,
  }),
};
