import Route from "@ember/routing/route";

export default class SearchBuildingRoute extends Route {
  queryParams = {
    projectId: {
      refreshModel: true,
    },
  };
  model({ projectId }) {
    return projectId;
  }
}
