import Service from "@ember/service";

export default class GwrConfigService extends Service {
  municipalityId = 1342; // Münchenbuchsee for testing
  municipalityName = "Galgenen";
  cantonAbbreviation = "SZ";

  get cssClasses() {
    return {
      button: ["uk-button", "uk-button-default"],
      "button-primary": "uk-button-primary",
      "button-small": "uk-button-small",

      form: "uk-form",
      select: "uk-select",
      textarea: "uk-textarea",
      radio: "uk-radio",
      checkbox: "uk-checkbox",
      range: "uk-range",
      input: "uk-input",
      "date-picker": "uk-input",

      "text-bold": "uk-text-bold",

      nav: "",
      "nav-list": "",
      "nav-item": "",

      "diff-highlight": "uk-box-shadow-small uk-padding-small",
      "diff-meta-text": "",
    };
  }
}
