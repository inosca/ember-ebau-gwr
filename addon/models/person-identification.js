import { tracked } from "@glimmer/tracking";

import XMLModel from "./xml-model";

export default class PersonIdentification extends XMLModel {
  @tracked officialName;
  @tracked firstName;

  constructor(xmlOrObject, root = "personIdentification") {
    super(xmlOrObject);
    this.setFieldsFromXML({
      root,
      fields: {
        officialName: String,
        firstName: String,
      },
    });
  }

  static template = `
  <personIdentification>
    <ns4:officialName>{{model.officialName}}</ns4:officialName>
    <ns4:firstName>{{model.firstName}}</ns4:firstName>
  </personIdentification>
  `;
}
