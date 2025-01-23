import EmberRouter from "@ember/routing/router";

import config from "test-app/config/environment";

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

//eslint-disable-next-line array-callback-return
Router.map(function () {
  this.mount("ember-ebau-gwr", { as: "gwr", path: "/:id" });
  this.mount("ember-ebau-gwr", { as: "gwr-global", path: "/" });
});
