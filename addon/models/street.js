import { tracked } from "@glimmer/tracking";

import Locality from "./locality";
import XMLModel from "./xml-model";

export class StreetDescription extends XMLModel {
  @tracked language;
  @tracked descriptionLong;
  @tracked descriptionShort;

  constructor(xmlOrObject, root = "description") {
    super(xmlOrObject);
    this.setFieldsFromXML({
      root,
      fields: {
        language: Number,
        descriptionLong: String,
        descriptionShort: String,
      },
    });
  }

  static template = `
  <ns2:description>
    <ns2:language>{{model.language}}</ns2:language>
    <ns2:descriptionLong>{{model.descriptionLong}}</ns2:descriptionLong>
    <ns2:descriptionShort>{{model.descriptionShort}}</ns2:descriptionShort>
  </ns2:description>
  `;
}

export default class Street extends XMLModel {
  @tracked ESID;
  @tracked isOfficialDescription;
  @tracked officialStreetNumber;
  @tracked streetKind;
  @tracked streetStatus;
  @tracked streetGeometry;
  @tracked description = new StreetDescription();
  @tracked locality = new Locality();

  constructor(xmlOrObject, root = "street") {
    super(xmlOrObject);
    this.setFieldsFromXML({
      root,
      fields: {
        ESID: Number,
        isOfficialDescription: Boolean,
        officialStreetNumber: Number,
        streetKind: Number,
        streetStatus: Number,
        streetGeometry: String,
        description: StreetDescription,
        locality: Locality,
      },
    });
  }

  static template = `
    {{#if model.ESID}}
      <ns2:street>
        <ns2:ESID>{{model.ESID}}</ns2:ESID>
        {{> StreetDescription model=model.description}}
        <ns2:streetGeometry>{{model.streetGeometry}}</ns2:streetGeometry>
        {{#if model.officialStreetNumber}}
          <ns2:officialStreetNumber>{{model.officialStreetNumber}}</ns2:officialStreetNumber>
          <ns2:isOfficialDescription>{{model.isOfficialDescription}}</ns2:isOfficialDescription>
          <ns2:streetStatus>{{model.streetStatus}}</ns2:streetStatus>
          <ns2:streetKind>{{model.streetKind}}</ns2:streetKind>
        {{/if}}
      </ns2:street>
    {{/if}}
  `;

  static streetKindOptions = [
    9801, // Strasse (Linienobjekt)
    9802, // Platz (Punktobjekt)
    9803, // Benanntes Gebiet (Flächenobjekt)
    9809, // Keine Angabe zur Geometrie
  ];
}

export class StreetList extends XMLModel {
  @tracked ESID;
  @tracked description = new StreetDescription();
  @tracked isOfficialDescription;
  @tracked streetStatus;
  @tracked localisationKind;
  @tracked locality = new Locality();

  constructor(xmlOrObject, root = "streetWithoutStreetGeometryType") {
    super(xmlOrObject);
    this.setFieldsFromXML({
      root,
      fields: {
        ESID: Number,
        isOfficialDescription: Boolean,
        streetStatus: Number,
        localisationKind: Number,
        locality: Locality,
        description: StreetDescription,
      },
    });
  }
}
