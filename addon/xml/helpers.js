import dayjs from "dayjs";

// All functions in this file will be registered to handlebars as helpers.

export function echDate(date) {
  return dayjs(date).format("YYYY-MM-DD");
}

export function or(...args) {
  // The last element in args is the helper definition past by handlebars
  // So we dont want to compare this.
  return args.length === 2 ? args[0] : args[0] || or(...args.slice(1));
}

export function and(...args) {
  // The last element in args is the helper definition passed by handlebars
  // So we dont want to compare this.
  return args.length === 2 ? args[0] : args[0] && and(...args.slice(1));
}
