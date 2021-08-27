import { tracked } from "@glimmer/tracking";

import RealestateIdentification from "./realestate-identification";
import XMLModel from "./xml-model";

export default class ConstructionProjectsList extends XMLModel {
  @tracked EPROID;
  @tracked officialConstructionProjectFileNo;
  @tracked extensionOfOfficialConstructionProjectFileNo;

  @tracked constructionProjectDescription;
  @tracked constructionSurveyDeptNumber;
  @tracked projectStatus;
  @tracked realestateIdentification = new RealestateIdentification();

  constructor(xmlOrObject, root = "constructionProjectsList") {
    super(xmlOrObject);
    this.setFieldsFromXML({
      root,
      fields: {
        EPROID: Number,
        officialConstructionProjectFileNo: String,
        extensionOfOfficialConstructionProjectFileNo: Number,
        constructionProjectDescription: String,
        constructionSurveyDeptNumber: String,
        projectStatus: Number,
        realestateIdentification: RealestateIdentification,
      },
    });
  }
}
