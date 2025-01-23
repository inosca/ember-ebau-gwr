"use strict";

module.exports = function (environment) {
  const ENV = {
    modulePrefix: "ember-ebau-gwr",
    environment,

    housingStatLinkTest: "https://www-r.housing-stat.ch",
    housingStatLinkProd: "https://www.housing-stat.ch",
  };

  return ENV;
};
