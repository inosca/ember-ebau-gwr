import { tracked } from "@glimmer/tracking";

import XMLModel from "./xml-model";

export class Country extends XMLModel {
  @tracked countryNameShort = "ch";

  constructor(...args) {
    super(...args);
    this.setFieldsFromXML({
      fields: {
        countryNameShort: String,
      },
    });
  }

  static template = `
    <ns5:country>
      <ns5:countryNameShort>{{model.countryNameShort}}</ns5:countryNameShort>
    </ns5:country>
  `;
}

export default class Address extends XMLModel {
  @tracked street;
  @tracked houseNumber;
  @tracked swissZipCode;
  @tracked swissZipCodeAddOn;
  @tracked foreignZipCode;
  @tracked addressLine2;
  @tracked country = new Country();

  constructor(...args) {
    super(...args);
    this.setFieldsFromXML({
      fields: {
        street: String,
        houseNumber: Number,
        swissZipCode: Number,
        swissZipCodeAddOn: Number,
        foreignZipCode: Number,
        addressLine2: String,
        country: Country,
      },
    });
  }

  static template = `
  <address>
    {{{modelField model "addressLine2" namespace="ns5:"}}}
    <ns5:street>{{model.street}}</ns5:street>
    <ns5:houseNumber>{{model.houseNumber}}</ns5:houseNumber>
    {{!--TODO: Town is ignored by the API, N/A is returned. 
      However, an error is returned if it isn't present.
      Remove once API no longer requires field --}}
    <ns5:town />
    {{#if (eq model.country.countryNameShort "ch")}}
      {{{modelField model "swissZipCode" namespace="ns5:"}}}
      {{{modelField model "swissZipCodeAddOn" namespace="ns5:"}}}
    {{else}}
      {{{modelField model "foreignZipCode" namespace="ns5:"}}}
    {{/if}}
    {{> Country model=model.country}}
  </address>
  `;
}
