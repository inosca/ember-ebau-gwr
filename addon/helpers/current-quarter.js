import { helper } from "@ember/component/helper";
import { DateTime } from "luxon";

// The quarterly closure starts two weeks before the actual quarter finishes.
const quarters = [
  { text: "Q4", firstWeekOfQuarter: 50 },
  { text: "Q3", firstWeekOfQuarter: 37 },
  { text: "Q2", firstWeekOfQuarter: 24 },
  { text: "Q1", firstWeekOfQuarter: 11 },
  { text: "Q4", firstWeekOfQuarter: 1 },
];

export const getCurrentQuarter = (_, { showYear = false }) => {
  const now = DateTime.now();
  const currentWeek = now.toFormat("W");

  const quarter = quarters.find(
    ({ firstWeekOfQuarter }) => currentWeek >= firstWeekOfQuarter
  )?.text;

  if (showYear) {
    // If we're already in the new year but not yet in week 11, this means we're still
    // working on the Q4 closure from last year. That's why we subtract one year from today.
    const year = (
      quarter === "Q4" && currentWeek < 11 ? now.minus({ years: 1 }) : now
    ).toFormat("yyyy");

    return `${quarter}/${year}`;
  }

  return quarter;
};

export default helper(getCurrentQuarter);
