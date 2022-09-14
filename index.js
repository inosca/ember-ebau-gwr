"use strict";

/* eslint-disable node/no-missing-require, node/no-unpublished-require, ember/avoid-leaking-state-in-ember-objects */
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
  included(...args) {
    const app = this._findHost(this);
    app.options["ember-validated-form"] = {
      theme: "uikit",
      defaults: {
        "types/date": "ember-ebau-gwr/components/model-form/date",
      },
    };
    this._super.included.apply(this, args);
  },
});
