import Application from "@ember/application";
import Resolver from "ember-resolver";
import loadInitializers from "ember-load-initializers";
import config from "dummy/config/environment";

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;

  constructor(...args) {
    super(...args);

    this.engines = {
      emberGwr: {
        dependencies: {
          services: [{ config: "gwr-config" }, "intl"],
        },
      },
    };
  }
}

loadInitializers(App, config.modulePrefix);
