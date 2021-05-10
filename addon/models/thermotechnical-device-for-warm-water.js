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

  static heatGeneratorHotWater = [
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
