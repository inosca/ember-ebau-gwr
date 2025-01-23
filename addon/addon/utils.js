export function isIsoDate(value) {
  const isoDateRegExp = new RegExp("^[0-9]{4}-[0-9]{2}-[0-9]{2}$");
  return (
    typeof value === "string" &&
    isoDateRegExp.test(value) &&
    !isNaN(new Date(value))
  );
}

// Transforms for data import
export const stripLeadingZero = (string) =>
  string.trim().replace(/^0+/, "").trim();

export const applyTransforms = (
  object,
  transforms, // {key: (any) => any}
) =>
  Object.keys(transforms).reduce((transformedData, transformKey) => {
    // No spread to improve performance
    transformedData[transformKey] = transforms[transformKey](
      object[transformKey],
    );
    return transformedData;
  }, object);
