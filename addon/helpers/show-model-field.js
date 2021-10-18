import { helper } from "@ember/component/helper";
import { get } from "@ember/object";

function showModelField([field, changeset, importData]) {
  const isSet = (value) => value !== undefined && value !== null;

  return changeset
    ? isSet(changeset.get(field)) ||
        (importData && isSet(get(importData.data, field)))
    : false;
}

export default helper(showModelField);
