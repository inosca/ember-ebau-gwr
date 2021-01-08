import { tracked } from "@glimmer/tracking";

import XMLModel from "./xml-model";

export default class RealestateIdentification extends XMLModel {
  @tracked number;
  @tracked EGRID;
  @tracked numberSuffix;
  @tracked subDistrict;
  @tracked lot;

  static template = `
  <ns2:realestateIdentification>
    <ns2:number>{{model.number}}</ns2:number>
    <ns2:EGRID>{{model.EGRID}}</ns2:EGRID>
  </ns2:realestateIdentification>
  `;
}
