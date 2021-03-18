import { tracked } from "@glimmer/tracking";

import Building from "./building";
import XMLModel from "./xml-model";

export default class BuildingList extends XMLModel {
  @tracked kindOfWork;
  @tracked ARBID;
  @tracked energeticRestauration;
  @tracked renovationHeatingsystem;
  @tracked innerConversionRenovation;
  @tracked conversion;
  @tracked extensionHeighteningHeated;
  @tracked extensionHeighteningNotHeated;
  @tracked thermicSolarFacility;
  @tracked photovoltaicSolarFacility;
  @tracked otherWorks;
  @tracked building = new Building();

  constructor(xmlOrObject, root = "work") {
    super(xmlOrObject);
    this.setFieldsFromXML({
      root,
      fields: {
        kindOfWork: Number,
        ARBID: Number,
        energeticRestauration: Boolean,
        renovationHeatingsystem: Boolean,
        innerConversionRenovation: Boolean,
        conversion: Boolean,
        extensionHeighteningHeated: Boolean,
        extensionHeighteningNotHeated: Boolean,
        thermicSolarFacility: Boolean,
        photovoltaicSolarFacility: Boolean,
        otherWorks: Boolean,
        building: Building,
      },
    });
  }
}
