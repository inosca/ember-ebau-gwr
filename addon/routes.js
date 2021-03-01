import buildRoutes from "ember-engines/routes";

export default buildRoutes(function () {
  this.route("search-project");
  this.route("project", { path: "/" }, function () {
    this.route("form", { path: "/form/:project_id" });
    this.route("new");
    // Later there will be a buildings route here etc
  });
});
