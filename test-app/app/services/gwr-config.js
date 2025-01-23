import { action } from "@ember/object";
import Service from "@ember/service";

export default class GwrConfigService extends Service {
  cantonAbbreviation = localStorage.getItem("canton");
  gwrAPI = "http://localhost:8010/proxy/regbl/api/ech0216/2";
  modalContainer = "#modal-container";
  isTestEnvironment = true;
  pageSize = 5;
  authToken = "token";
  camacGroup = "1";
  projectSortColumn = "bau_modify_date";
  projectSortDirection = "desc";
  buildingSortColumn = "geb_modify_date";
  buildingSortDirection = "desc";
  quarterlyClosureSortColumn = "bau_create_date";
  quarterlyClosureSortDirection = "desc";

  get importModels() {
    return ["project", "building", "dwelling", "entrance"];
  }

  @action
  async fetchInstanceLinks(localIds) {
    return [...new Set(localIds)].map((localId) => ({
      localId,
      identifier: `1234-12-${localId}`,
      hostLink: `/${localId}`,
    }));
  }
}
