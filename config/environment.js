"use strict";

module.exports = function (environment) {
  const ENV = {
    modulePrefix: "ember-ebau-gwr",
    environment,

    housingStatLinkTest: "https://www-r.housing-stat.ch",
    housingStatLinkProd: "https://www.housing-stat.ch",

    "ember-validated-form": {
      theme: "uikit",
      defaults: {
        // default components
      },
    },

    // !!! WARNING !!!
    // TODO: We have to find out how we can configure this in the host app.
    "changeset-validations": { rawOutput: true },
  };

  return ENV;
};
