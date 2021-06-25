import { get } from "@ember/object";
import buildMessage from "ember-changeset-validations/utils/validation-errors";
import evValidatePresence from "ember-validators/presence";

// Hopefully this can be removed once this is fixed / resolved:
// https://github.com/poteto/ember-changeset-validations/pull/305
export function validatePresenceNested(options) {
  let targets;
  if (typeof options === "boolean") {
    options = { presence: options };
  } else if (options && options.on !== undefined) {
    if (typeof options.on === "string") {
      targets = [options.on];
    } else if (Array.isArray(options.on)) {
      targets = options.on;
    }

    delete options.on;
  }

  return (key, value, _oldValue, changes, content) => {
    if (
      targets &&
      !targets.some(
        (target) =>
          get(changes, target) ||
          (get(changes, target) === undefined && get(content, target))
      )
    ) {
      return true;
    }

    const result = evValidatePresence(value, options, null, key);

    if (typeof result === "boolean" || typeof result === "string") {
      return result;
    }
    // We flipped the meaning behind `present` and `blank` so switch the two
    if (result.type === "present") {
      result.type = "blank";
    } else if (result.type === "blank") {
      result.type = "present";
    }

    return buildMessage(key, result);
  };
}
