import { tracked } from "@glimmer/tracking";

import XMLModel from "./xml-model";

export default class ConstructionProject extends XMLModel {
  @tracked EGID;
  @tracked nameOfBuilding;

  constructor(...args) {
    super(...args);
    this.setFieldsFromXML({
      root: "building",
      fields: {
        EGID: Number,
        nameOfBuilding: String,
      },
    });
  }
  static template = `
  <ns2:building>
  </ns2:building>
  `;
}
