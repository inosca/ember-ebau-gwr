import buildRoutes from "ember-engines/routes";

export default buildRoutes(function () {
  this.route("global-landing-page", { path: "/" });
  this.route("quarterly-closure");

  this.route("search-project");
  this.route("search-building");

  this.route("project", { path: "/projects" }, function () {
    this.route("form", { path: "/:project_id/form" });
    this.route("new");
    this.route("linked-buildings", { path: "/:project_id/buildings" });
    this.route("errors", { path: "/:project_id/errors" });
  });
  this.route("building", function () {
    this.route("new");
    this.route("edit", { path: "/:building_id" }, function () {
      this.route("form");
      this.route("entrances");
      this.route("dwellings");

      this.route("entrance", function () {
        this.route("new");
        this.route("edit", { path: "/:entrance_id" }, function () {
          this.route("link-street");
        });
      });
      this.route("dwelling", function () {
        this.route("new");
        this.route("edit", { path: "/:dwelling_id" });
      });
    });
  });
});
