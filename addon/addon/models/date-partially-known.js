import { tracked } from "@glimmer/tracking";

import XMLModel from "./xml-model";

export default class DatePartiallyKnown extends XMLModel {
  @tracked yearMonthDay;
  @tracked yearMonth;
  @tracked year;

  constructor(xmlOrObject, root = "") {
    super(xmlOrObject);
    this.setFieldsFromXML({
      root,
      fields: {
        yearMonthDay: Date,
        yearMonth: String,
        year: String,
      },
    });
  }
}
