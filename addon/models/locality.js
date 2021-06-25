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

  static template = `
    <ns2:name>
      <ns2:nameLong>{{model.nameLong}}</ns2:nameLong>
      {{#if model.nameShort}}
        <ns2:nameShort>{{model.nameShort}}</ns2:nameShort>
      {{/if}}
    </ns2:name>
  `;
}

export default class Locality extends XMLModel {
  @tracked swissZipCode;
  @tracked swissZipCodeAddOn;
  @tracked name = new LocalityName();
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

  static template = `
    <ns2:locality>
      {{#if model.swissZipCode}}
        <ns2:swissZipCode>{{model.swissZipCode}}</ns2:swissZipCode>
      {{/if}}
      {{#if model.swissZipCodeAddOn}}
        <ns2:swissZipCodeAddOn>{{model.swissZipCodeAddOn}}</ns2:swissZipCodeAddOn>
      {{/if}}
      {{> LocalityName model=model.name}}
    </ns2:locality>
  `;
}
