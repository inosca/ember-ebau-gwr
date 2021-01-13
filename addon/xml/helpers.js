import dayjs from "dayjs";

// All functions in this file will be registered to handlebars as helpers.

export function echDate(date) {
  return dayjs(date).format("YYYY-MM-DD");
}
