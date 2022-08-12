import Route from "@ember/routing/route";

export default class BuildingEditRoute extends Route {
  model({ building_id: buildingId }) {
    return {
      buildingId,
      projectId: this.modelFor("building"),
      caseId: this.modelFor("application")?.id,
    };
  }
}
