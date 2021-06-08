import { tracked } from "@glimmer/tracking";

import Heating from "./heating";

export default class ThermotechnicalDeviceForWarmWater extends Heating {
  @tracked heatGeneratorHotWater;

  constructor(xmlOrObject, root = "thermotechnicalDeviceForWarmWater") {
    super(xmlOrObject, root);
    this.setFieldsFromXML({
      root,
      fields: {
        heatGeneratorHotWater: Number,
      },
    });
  }

  static template = `
  {{#if model.heatGeneratorHotWater}}
    <ns2:{{or tagName "thermotechnicalDeviceForWarmWater"}}>
      <heatGeneratorHotWater>{{model.heatGeneratorHotWater}}</heatGeneratorHotWater>
      {{#if model.energySourceHeating}}
        <energySourceHeating>{{model.energySourceHeating}}</energySourceHeating>
      {{/if}}
      {{#if model.informationSourceHeating}}
        <informationSourceHeating>{{model.informationSourceHeating}}</informationSourceHeating>
      {{/if}}
      {{#if model.revisionDate}}
        <revisionDate>{{echDate model.revisionDate}}</revisionDate>
      {{/if}}
    </ns2:{{or tagName "thermotechnicalDeviceForWarmWater"}}>
  {{/if}}
  `;

  static heatGeneratorHotWaterOptions = [
    7600, // Kein Wärmeerzeuger
    7610, // Wärmepumpe
    7620, // Thermische Solaranlage
    7630, // Heizkessel (generisch)
    7632, // Heizkessel nicht kondensierend
    7634, // Heizkessel kondensierend
    7640, // Wärmekraftkopplungsanlage
    7650, // Zentraler Elektroboiler
    7651, // Kleinboiler
    7660, // Wärmetauscher (einschliesslich für Fernwärme)
    7699, // Andere
  ];
}
