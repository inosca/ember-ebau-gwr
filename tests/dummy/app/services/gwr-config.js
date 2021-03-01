import Service from "@ember/service";

export default class GwrConfigService extends Service {
  municipalityId = 1342; // Münchenbuchsee for testing
  municipalityName = "Galgenen";
  cantonAbbreviation = "SZ";
  constructionSurveyDept = 134200;
  importApi = "http://example.com/api/instances/{instanceId}/gwr";
}
