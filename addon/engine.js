import Engine from "@ember/engine";

import loadInitializers from "ember-load-initializers";
import Resolver from "ember-resolver";

import config from "ember-ebau-gwr/config/environment";

const { modulePrefix } = config;

export default class EmberGWREngine extends Engine {
  modulePrefix = modulePrefix;
  Resolver = Resolver;

  dependencies = {
    services: ["config", "intl"],
  };
}

loadInitializers(EmberGWREngine, modulePrefix);
