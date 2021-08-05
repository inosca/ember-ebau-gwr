import Service from "@ember/service";

export default class GwrConfigService extends Service {
  municipality = 1342;
  cantonAbbreviation = "SZ";
  gwrAPI = "http://localhost:8010/proxy/regbl/api/ech0216/2";
  modalContainer = "#modal-container";

  get authToken() {
    return "token";
  }

  get camacGroup() {
    return "1";
  }

  get importModels() {
    return ["project", "building", "dwelling", "entrance"];
  }
}
