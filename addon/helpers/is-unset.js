import { helper } from "@ember/component/helper";

const isUnset = function isUnset([value]) {
  return value === null || value === undefined || isNaN(value);
};

export default helper(isUnset);
