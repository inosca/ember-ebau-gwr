import { tracked } from "@glimmer/tracking";

import XMLModel from "./xml-model";

export default class DateOfDemolition extends XMLModel {
  @tracked yearMonthDay;
  @tracked yearMonth;
  @tracked year;

  constructor(xmlOrObject, root = "dateOfDemolition") {
    super(xmlOrObject);
    this.setFieldsFromXML({
      root,
      fields: {
        yearMonthDay: String,
        yearMonth: String,
        year: String,
      },
    });
  }
}
