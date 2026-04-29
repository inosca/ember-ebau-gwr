import { validatePresence } from "ember-changeset-validations/validators";

export default {
  removeReason: validatePresence({ presence: true, ignoreBlank: true }),
};
