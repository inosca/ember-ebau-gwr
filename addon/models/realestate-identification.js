import { tracked } from "@glimmer/tracking";

import XMLModel from "./xml-model";

export default class RealestateIdentification extends XMLModel {
  @tracked number;
  @tracked EGRID;
  @tracked numberSuffix;
  @tracked subDistrict;
  @tracked lot;

  constructor(...args) {
    super(...args);
    this.setFieldsFromXML({
      namespace: "realestateIdentification",
      fields: {
        number: Number,
        EGRID: Number,
        numberSuffix: Number,
        subDistrict: Number,
        lot: Number,
      },
    });
  }

  static template = `
  <ns2:realestateIdentification>
    <ns2:number>{{model.number}}</ns2:number>
    <ns2:EGRID>{{model.EGRID}}</ns2:EGRID>
  </ns2:realestateIdentification>
  `;
}
