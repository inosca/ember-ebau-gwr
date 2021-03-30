import { tracked } from "@glimmer/tracking";

import XMLModel from "./xml-model";

export class StreetDescription extends XMLModel {
  @tracked language;
  @tracked descriptionLong;
  @tracked descriptionShort;

  constructor(xmlOrObject, root = "description") {
    super(xmlOrObject);
    this.setFieldsFromXML({
      root,
      fields: {
        language: Number,
        descriptionLong: String,
        descriptionShort: String,
      },
    });
  }
}

export default class Street extends XMLModel {
  @tracked ESID;
  @tracked isOfficialStreetNumber;
  @tracked officialStreetNumber;
  @tracked streetKind;
  @tracked streetStatus;
  @tracked description;
  constructor(xmlOrObject, root = "street") {
    super(xmlOrObject);
    this.setFieldsFromXML({
      root,
      fields: {
        ESID: Number,
        isOfficialStreetNumber: Number,
        officialStreetNumber: Number,
        streetKind: Number,
        streetStatus: Number,
        description: StreetDescription,
      },
    });
  }
}
