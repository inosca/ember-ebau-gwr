import { tracked } from "@glimmer/tracking";

import XMLModel from "./xml-model";

export default class PersonIdentification extends XMLModel {
  @tracked officialName;
  @tracked firstName;

  static template = `
  <personIdentification>
    <ns4:officialName>{{model.officialName}}</ns4:officialName>
    <ns4:firstName>{{model.firstName}}</ns4:firstName>
  </personIdentification>
  `;
}
