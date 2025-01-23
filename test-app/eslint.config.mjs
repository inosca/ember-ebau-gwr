import adfinisEmberAddonConfig from "@adfinis/eslint-config/ember-addon";
import ember from "eslint-plugin-ember";

export default [
  ...adfinisEmberAddonConfig,
  {
    plugins: { ember },
    settings: {
      "import/internal-regex": "^(camac-ng|test-app)/",
    },

    rules: {
      "ember/no-runloop": "warn",
    },
  },
  {
    ignores: [
      "blueprints/*/files/",
      "declarations/",
      "dist/",
      "coverage/",
      "!**/.*",
      "**/.*/",
      ".node_modules.ember-try/",
    ],
  },
];
