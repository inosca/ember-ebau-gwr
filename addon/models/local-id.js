import { tracked } from "@glimmer/tracking";

import XMLModel from "./xml-model";

// TODO_BUILDING: figure out all of the correct types once api and ech website are up an d running again
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
