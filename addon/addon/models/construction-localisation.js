import { tracked } from "@glimmer/tracking";

import XMLModel from "./xml-model";

export default class ConstructionLocalisation extends XMLModel {
  @tracked municipalityId;
  @tracked municipalityName = "";
  @tracked cantonAbbreviation;

  constructor(...args) {
    super(...args);
    this.setFieldsFromXML({
      fields: {
        municipalityId: Number,
        municipalityName: String,
        cantonAbbreviation: String,
      },
    });
  }

  static template = `
  <ns2:constructionLocalisation>
    <ns2:municipalityId>{{model.municipalityId}}</ns2:municipalityId>
    <ns2:municipalityName>{{model.municipalityName}}</ns2:municipalityName>
    <ns2:cantonAbbreviation>{{model.cantonAbbreviation}}</ns2:cantonAbbreviation>
  </ns2:constructionLocalisation>
  `;
}
