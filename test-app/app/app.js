import Application from "@ember/application";
import loadInitializers from "ember-load-initializers";
import Resolver from "ember-resolver";

import config from "test-app/config/environment";

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;

  constructor(...args) {
    super(...args);

    this.engines = {
      "ember-ebau-gwr": {
        dependencies: {
          services: [
            { config: "gwr-config" },
            "intl",
            "notification",
            "dataImport",
            "store",
            "session",
          ],
        },
      },
    };
  }
}

loadInitializers(App, config.modulePrefix);
