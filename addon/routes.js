import buildRoutes from "ember-engines/routes";

export default buildRoutes(function () {
  this.route("landing-page", { path: "/start" });
  this.route("project", { path: "/" }, function () {
    this.route("link-existing");
  });
});
