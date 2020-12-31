import { tracked } from "@glimmer/tracking";
import XMLModel from "./xml-model";

export default class ConstructionLocalisation extends XMLModel {
  @tracked municipalityId;
  @tracked municipalityName;
  @tracked cantonAbbreviation;

  constructor(...args) {
    super(...args);

    this.municipalityId = this.getFieldFromXML(
      "constructionLocalisation.municipalityId"
    );
    this.municipalityName = this.getFieldFromXML(
      "constructionLocalisation.municipalityName"
    );
    this.cantonAbbreviation = this.getFieldFromXML(
      "constructionLocalisation.cantonAbbreviation"
    );
  }
}
