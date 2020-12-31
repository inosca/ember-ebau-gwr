"use strict";

const EngineAddon = require("ember-engines/lib/engine-addon");

module.exports = EngineAddon.extend({
  name: require("./package").name,
  lazyLoading: {
    enabled: false,
  },
  autoImport: {
    alias: {
      handlebars: "handlebars/dist/handlebars",
    },
  },
});
