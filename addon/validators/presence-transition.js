import { validatePresence } from "ember-changeset-validations/validators";

export default function validatePresenceTransition({
  presence,
  on,
  transitions,
  data,
  model,
} = {}) {
  return (key, newValue, oldValue, changes, content) => {
    const currentTransition =
      data[`${model}TransitionMapping`][content[on]][changes[on]];

    if (!transitions.includes(currentTransition)) {
      return true;
    }

    const validator = validatePresence({ presence, on, ignoreBlank: true });
    return validator(key, newValue, oldValue, changes, content);
  };
}
