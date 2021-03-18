import buildRoutes from "ember-engines/routes";

export default buildRoutes(function () {
  this.route("search-project");
  this.route("search-building");
  this.route("project", { path: "/" }, function () {
    this.route("form", { path: "/:project_id/form" });
    this.route("new");
    this.route("linked-buildings", { path: "/:project_id/buildings" });
  });
  this.route("building", { path: "/:project_id/building/" }, function () {
    this.route("form", { path: "/:building_id/form" });
    this.route("new");
  });
});
