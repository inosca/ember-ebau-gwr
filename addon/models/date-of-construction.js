import { tracked } from "@glimmer/tracking";

import XMLModel from "./xml-model";

export default class DateOfConstruction extends XMLModel {
  @tracked yearMonthDay;
  @tracked yearMonth;
  @tracked year;
  @tracked periodOfConstruction;

  constructor(xmlOrObject) {
    super(xmlOrObject);
    this.setFieldsFromXML({
      fields: {
        yearMonthDay: String,
        yearMonth: String,
        year: String,
        periodOfConstruction: Number,
      },
    });
  }
}
