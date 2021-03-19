import { tracked } from "@glimmer/tracking";

import XMLModel from "./xml-model";

export default class Building extends XMLModel {
  @tracked EGID;
  @tracked nameOfBuilding;

  constructor(...args) {
    super(...args);
    this.setFieldsFromXML({
      fields: {
        EGID: Number,
        nameOfBuilding: String,
      },
    });
  }
}
