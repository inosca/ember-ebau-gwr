import { helper } from "@ember/component/helper";
import { get } from "@ember/object";

function showModelField([field, changeset, importedData]) {
  const isSet = (value) => value !== undefined && value !== null;

  return changeset
    ? isSet(changeset.get(field)) ||
        (importedData && isSet(get(importedData.data, field)))
    : false;
}

export default helper(showModelField);
