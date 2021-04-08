import Service from "@ember/service";

export default class GwrConfigService extends Service {
  municipalityId = 1342;
  municipalityName = "Galgenen";
  cantonAbbreviation = "SZ";
  constructionSurveyDeptNumber = 134200;
  gwrAPI = "http://localhost:8010/proxy/regbl/api/ech0216/2";
}
