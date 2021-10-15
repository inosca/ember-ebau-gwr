export function isIsoDate(value) {
  const isoDateRegExp = new RegExp("^[0-9]{4}-[0-9]{2}-[0-9]{2}$");
  return (
    typeof value === "string" &&
    isoDateRegExp.test(value) &&
    !isNaN(new Date(value))
  );
}
