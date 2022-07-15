import { helper } from "@ember/component/helper";
import { DateTime } from "luxon";

const currentQuarter = function isUnset([format = "q/yyyy"]) {
  return `Q${DateTime.now().toFormat(format)}`;
};

export default helper(currentQuarter);
