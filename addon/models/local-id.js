import { tracked } from "@glimmer/tracking";

import XMLModel from "./xml-model";

export default class LocalId extends XMLModel {
  @tracked IdCategory;
  @tracked Id;

  constructor(xmlOrObject, root = "localId") {
    super(xmlOrObject);
    this.setFieldsFromXML({
      root,
      fields: {
        IdCategory: String,
        Id: String,
      },
    });
  }
}
