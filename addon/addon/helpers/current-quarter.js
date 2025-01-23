import { helper } from "@ember/component/helper";
import { DateTime } from "luxon";

// The quarterly closure starts two weeks before the actual quarter finishes.
const quarters = [
  { quarter: 4, label: "Q4", firstWeekOfQuarter: 50 },
  { quarter: 3, label: "Q3", firstWeekOfQuarter: 37 },
  { quarter: 2, label: "Q2", firstWeekOfQuarter: 24 },
  { quarter: 1, label: "Q1", firstWeekOfQuarter: 11 },
  { quarter: 4, label: "Q4", firstWeekOfQuarter: 1 },
];

export const getCurrentQuarter = (date = DateTime.now()) => {
  const currentWeek = parseInt(date.toFormat("W"));

  const currentQuarter = quarters.find(
    ({ firstWeekOfQuarter }) => currentWeek >= firstWeekOfQuarter,
  );
  return {
    ...currentQuarter,
    // If we're already in the new year but not yet in week 11, this means we're still
    // working on the Q4 closure from last year. That's why we subtract one year from today.
    year: (currentQuarter.quarter === 4 && currentWeek < 11
      ? date.minus({ years: 1 })
      : date
    ).toFormat("yyyy"),
  };
};

export const getCurrentQuarterString = (_, { showYear = false }) => {
  const { label, year } = getCurrentQuarter();
  return showYear ? `${label}/${year}` : label;
};

export default helper(getCurrentQuarterString);
