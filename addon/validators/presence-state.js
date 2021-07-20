import { validatePresence } from "ember-changeset-validations/validators";

export default function validatePresenceState({ presence, on, states } = {}) {
  return (key, newValue, oldValue, changes, content) => {
    const dependentField = changes[on] ?? content[on];
    if (!states.includes(dependentField)) {
      return true;
    }

    const validator = validatePresence({ presence, on, ignoreBlank: true });
    return validator(key, newValue, oldValue, changes, content);
  };
}
