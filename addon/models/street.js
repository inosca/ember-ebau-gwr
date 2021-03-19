import { tracked } from "@glimmer/tracking";

import XMLModel from "./xml-model";

export class StreetDescription extends XMLModel {
  @tracked language;
  @tracked descriptionLong;
  @tracked descriptionShort;

  constructor(xmlOrObject) {
    super(xmlOrObject);
    this.setFieldsFromXML({
      root: "description",
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
  constructor(xmlOrObject) {
    super(xmlOrObject);
    this.setFieldsFromXML({
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
