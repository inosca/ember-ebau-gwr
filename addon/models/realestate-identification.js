import { tracked } from "@glimmer/tracking";

import XMLModel from "./xml-model";

export default class RealestateIdentification extends XMLModel {
  @tracked number;
  @tracked EGRID;
  @tracked subDistrict;

  constructor(...args) {
    super(...args);
    this.setFieldsFromXML({
      fields: {
        number: String,
        EGRID: String,
        subDistrict: Number,
      },
    });
  }

  // TODO on a new project we can somehow not set the egrid

  static template = `
  {{#if model.number}}
    <ns2:realestateIdentification>
      {{{modelField model "EGRID" namespace=""}}}
      <number>{{model.number}}</number>
      {{{modelField model "subDistrict" namespace=""}}}
    </ns2:realestateIdentification>
  {{/if}}
  `;
}
