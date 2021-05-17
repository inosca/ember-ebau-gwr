import { tracked } from "@glimmer/tracking";

import Heating from "./heating";

export default class ThermotechnicalDeviceForHeating extends Heating {
  @tracked heatGeneratorHeating;

  constructor(xmlOrObject, root = "thermotechnicalDeviceForHeating") {
    super(xmlOrObject, root);
    this.setFieldsFromXML({
      root,
      fields: {
        heatGeneratorHeating: Number,
      },
    });
  }

  static template = `
  {{#if model.heatGeneratorHeating}}
    <ns2:{{or tagName "thermotechnicalDeviceForHeating"}}>
      <heatGeneratorHeating>{{model.heatGeneratorHeating}}</heatGeneratorHeating>
      {{#if model.energySourceHeating}}
        <energySourceHeating>{{model.energySourceHeating}}</energySourceHeating>
      {{/if}}
      {{#if model.informationSourceHeating}}
        <informationSourceHeating>{{model.informationSourceHeating}}</informationSourceHeating>
      {{/if}}
      {{#if model.revisionDate}}
        <revisionDate>{{echDate model.revisionDate}}</revisionDate>
      {{/if}}
    </ns2:{{or tagName "thermotechnicalDeviceForHeating"}}>
  {{/if}}
  `;

  static heatGeneratorHeatingOptions = [
    7400, // Kein Wärmeerzeuger
    7410, // Wärmepumpe für ein Gebäude
    7411, // Wärmepumpe für mehrere Gebäude
    7420, // Thermische Solaranlage für ein Gebäude
    7421, // Thermische Solaranlage für mehrere Gebäude
    7430, // Heizkessel (generisch) für ein Gebäude
    7431, // Heizkessel (generisch) für mehrere Gebäude
    7432, // Heizkessel nicht kondensierend für ein Gebäude
    7433, // Heizkessel nicht kondensierend für mehrere Gebäude
    7434, // Heizkessel kondensierend für ein Gebäude
    7435, // Heizkessel kondensierend für mehrere Gebäude
    7436, // Ofen
    7440, // Wärmekraftkopplungsanlage für ein Gebäude
    7441, // Wärmekraftkopplungsanlage für mehrere Gebäude
    7450, // Elektrospeicher-Zentralheizung für ein Gebäude
    7451, // Elektrospeicher-Zentralheizung für mehrere Gebäude
    7452, // Elektro direkt
    7460, // Wärmetauscher (einschliesslich für Fernwärme) für ein Gebäude
    7461, // Wärmetauscher (einschliesslich für Fernwärme) für mehrere Gebäude
    7499, // Andere
  ];
}
