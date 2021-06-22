"use strict";

module.exports = function (environment) {
  const ENV = {
    modulePrefix: "ember-ebau-gwr",
    environment,

    "ember-validated-form": {
      theme: "uikit",
      defaults: {
        // default components
      },
    },
  };

  return ENV;
};
