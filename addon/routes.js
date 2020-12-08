import buildRoutes from "ember-engines/routes";

export default buildRoutes(function () {
  this.route("project", { path: "/" }, function () {
    this.route("link-existing", { path: "/link-existing" });
  });
});
