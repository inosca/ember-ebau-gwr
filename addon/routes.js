import buildRoutes from "ember-engines/routes";

export default buildRoutes(function () {
  this.route("landing-page", { path: "/start" });
  this.route("search-project");
  this.route("project", { path: "/" }, function () {
    // Later there will be a buildings route here etc
    // We leave the empty function param in so we can use the
    // project.index route already.
  });
});
