import { helper } from "@ember/component/helper";
import { get } from "@ember/object";

function showModelField([field, maybeChangeset, importedData]) {
  const isSet = (value) => value !== undefined && value !== null;

  return maybeChangeset
    ? isSet(maybeChangeset.get?.(field) || maybeChangeset[field]) ||
        (importedData && isSet(get(importedData.data, field)))
    : false;
}

export default helper(showModelField);
