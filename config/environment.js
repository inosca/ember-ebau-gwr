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
  };

  return ENV;
};
