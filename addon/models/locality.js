import { tracked } from "@glimmer/tracking";

import XMLModel from "./xml-model";

export class LocalityName extends XMLModel {
  @tracked language;
  @tracked nameLong;
  @tracked nameShort;

  constructor(xmlOrObject) {
    super(xmlOrObject);
    this.setFieldsFromXML({
      root: "name",
      fields: {
        language: Number,
        nameLong: String,
        nameShort: String,
      },
    });
  }
}

export default class Locality extends XMLModel {
  @tracked swissZipCode;
  @tracked swissZipCodeAddOn;
  @tracked name;
  constructor(xmlOrObject) {
    super(xmlOrObject);
    this.setFieldsFromXML({
      fields: {
        swissZipCode: Number,
        swissZipCodeAddOn: Number,
        name: LocalityName,
      },
    });
  }
}
