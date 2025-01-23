import { tracked } from "@glimmer/tracking";

import ErrorList from "./error-list";
import XMLModel from "./xml-model";

export default class CheckSurveyDepartmentResponse extends XMLModel {
  @tracked constructionSurveyDeptNumber;
  @tracked errorList;

  constructor(xmlOrObject, root = "checkQuaterlySurveyDeptResponse") {
    super(xmlOrObject);
    this.setFieldsFromXML({
      root,
      fields: {
        constructionSurveyDeptNumber: Number,
        errorList: [ErrorList],
      },
    });
  }
}
