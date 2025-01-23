import { tracked } from "@glimmer/tracking";

import ErrorList from "./error-list";
import XMLModel from "./xml-model";

export default class CheckConstructionProjectResponse extends XMLModel {
  @tracked EPROID;
  @tracked errorList;

  constructor(xmlOrObject, root = "checkConstructionProjectResponse") {
    super(xmlOrObject);
    this.setFieldsFromXML({
      root,
      fields: {
        EPROID: Number,
        errorList: [ErrorList],
      },
    });
  }
}
