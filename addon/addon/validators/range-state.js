import {
  validateNumber,
  validateInclusion,
} from "ember-changeset-validations/validators";

export default function validateRangeState({ range, on, states } = {}) {
  return (key, newValue, oldValue, changes, content) => {
    const inclusionValidator = validateInclusion({ list: states });
    const isIncluded = inclusionValidator(
      on,
      changes[on] ?? content[on],
      content[on],
      changes,
      content,
    );
    if (isIncluded !== true) {
      return true;
    }

    const numberValidator = validateNumber({
      gte: range[0],
      lte: range[1],
      allowString: true,
    });
    return numberValidator(key, newValue, oldValue, changes, content);
  };
}
