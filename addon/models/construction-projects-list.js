import { tracked } from "@glimmer/tracking";

import RealestateIdentification from "./realestate-identification";
import XMLModel from "./xml-model";

export default class ConstructionProjectsList extends XMLModel {
  @tracked EPROID;
  @tracked officialConstructionProjectFileNo;
  @tracked extensionOfOfficialConstructionProjectFileNo;

  @tracked constructionProjectDescription;
  @tracked constructionSurveyDept;
  @tracked projectStatus;
  @tracked realestateIdentification = new RealestateIdentification();

  constructor(xmlOrObject, root = "constructionProjectsList") {
    super(xmlOrObject);
    this.setFieldsFromXML({
      root,
      fields: {
        EPROID: Number,
        officialConstructionProjectFileNo: String,
        extensionOfOfficialConstructionProjectFileNo: String,
        constructionProjectDescription: String,
        constructionSurveyDept: String,
        projectStatus: Number,
        realestateIdentification: RealestateIdentification,
      },
    });
  }
}
