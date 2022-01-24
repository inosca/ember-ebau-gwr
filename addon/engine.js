import Engine from "@ember/engine";
import config from "ember-ebau-gwr/config/environment";
import loadInitializers from "ember-load-initializers";
import Resolver from "ember-resolver";

const { modulePrefix } = config;

export default class EmberGWREngine extends Engine {
  modulePrefix = modulePrefix;
  Resolver = Resolver;

  dependencies = {
    services: [
      "config",
      "intl",
      "notification",
      "dataImport",
      "store",
      "session",
    ],
  };
}

loadInitializers(EmberGWREngine, modulePrefix);
