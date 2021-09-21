import { validateNumber } from "ember-changeset-validations/validators";

export default function validateRangeState({ range, on, states } = {}) {
  return (key, newValue, oldValue, changes, content) => {
    const dependentField = changes[on] ?? content[on];
    if (!states.includes(dependentField)) {
      return true;
    }

    const validator = validateNumber({
      gte: range[0],
      lte: range[1],
      allowString: true,
    });
    return validator(key, newValue, oldValue, changes, content);
  };
}
