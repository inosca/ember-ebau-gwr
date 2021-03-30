import { tracked } from "@glimmer/tracking";

import XMLModel from "./xml-model";

export default class Building extends XMLModel {
  @tracked EGID;
  @tracked nameOfBuilding;

  constructor(xmlOrObject, root = "building") {
    super(xmlOrObject);
    this.setFieldsFromXML({
      root,
      fields: {
        EGID: Number,
        nameOfBuilding: String,
      },
    });
  }
}
