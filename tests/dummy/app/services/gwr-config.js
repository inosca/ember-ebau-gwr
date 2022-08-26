import Service from "@ember/service";

export default class GwrConfigService extends Service {
  cantonAbbreviation = "SZ";
  gwrAPI = "http://localhost:8010/proxy/regbl/api/ech0216/2";
  modalContainer = "#modal-container";
  isTestEnvironment = true;
  pageSize = 20;
  authToken = "token";
  camacGroup = "1";

  get importModels() {
    return ["project", "building", "dwelling", "entrance"];
  }
}
