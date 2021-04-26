import Service from "@ember/service";

export default class GwrConfigService extends Service {
  municipalityId = 1342;
  cantonAbbreviation = "SZ";
  gwrAPI = "http://localhost:8010/proxy/regbl/api/ech0216/2";

  get constructionSurveyDeptNumber() {
    return `${this.municipalityId}00`;
  }

  get authToken() {
    return "token";
  }

  get camacGroup() {
    return "1";
  }
}
