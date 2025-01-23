import { helper } from "@ember/component/helper";

export function isUnset(value) {
  return value === null || value === undefined;
}

export default helper(([value]) => isUnset(value));
