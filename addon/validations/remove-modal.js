import {
  validateLength,
  validatePresence,
} from "ember-changeset-validations/validators";

export default {
  removeReason: [
    (key, value) => {
      return validateLength({ min: 10 })(
        key,
        value
          ? value
              // replace multiple whitespaces with one
              .replace(/[\s]+/gm, " ")
              // trim left and right whitespace
              .trim()
          : "",
      );
    },
    validatePresence({ presence: true, ignoreBlank: true }),
  ],
};
