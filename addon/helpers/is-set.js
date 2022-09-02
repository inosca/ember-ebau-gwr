import { helper } from "@ember/component/helper";

import { isUnset } from "./is-unset";

export function isSet(...args) {
  return !isUnset(...args);
}

export default helper(([value]) => isSet(value));
