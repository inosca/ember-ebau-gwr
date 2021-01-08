import { tracked } from "@glimmer/tracking";

import XMLModel from "./xml-model";

export default class Address extends XMLModel {
  @tracked street;
  @tracked houseNumber;
  @tracked swissZipCode;
  @tracked town;
  @tracked country;

  static template = `
  <address>
    <ns5:street>{{model.street}}</ns5:street>
    <ns5:houseNumber>{{model.houseNumber}}</ns5:houseNumber>
    <ns5:swissZipCode>{{model.swissZipCode}}</ns5:swissZipCode>
    <ns5:town>{{model.town}}</ns5:town>
    <ns5:country>{{model.country}}</ns5:country>
  </address>
  `;
}
