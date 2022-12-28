"use strict";

module.exports = {
  extends: "recommended",
  rules: {
    "no-bare-strings": true,
    "no-implicit-this": { allow: ["housing-stat-link", "current-quarter"] },
    "no-curly-component-invocation": { allow: ["current-quarter"] },
  },
  overrides: [
    {
      files: ["tests/**/*"],
      rules: { "no-bare-strings": false },
    },
  ],
};
