import Service from "@ember/service";

export default class GwrConfigService extends Service {
  cantonAbbreviation = "SZ";
  gwrAPI = "http://localhost:8010/proxy/regbl/api/ech0216/2";
  modalContainer = "#modal-container";
  isTestEnvironment = true;
  pageSize = 20;
  authToken = "token";
  camacGroup = "1";
  projectSortColumn = "bau_modify_date";
  projectSortDirection = "desc";
  buildingSortColumn = "geb_modify_date";
  buildingSortDirection = "desc";

  get importModels() {
    return ["project", "building", "dwelling", "entrance"];
  }
}
