import { tracked } from "@glimmer/tracking";

import Building from "./building";
import XMLModel from "./xml-model";

export default class BuildingWork extends XMLModel {
  @tracked kindOfWork = BuildingWork.kindOfWorkOptions[0];
  @tracked ARBID;
  @tracked energeticRestauration = false;
  @tracked renovationHeatingsystem = false;
  @tracked innerConversionRenovation = false;
  @tracked conversion = false;
  @tracked extensionHeighteningHeated = false;
  @tracked extensionHeighteningNotHeated = false;
  @tracked thermicSolarFacility = false;
  @tracked photovoltaicSolarFacility = false;
  @tracked otherWorks = false;
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

  static template = `
  <ns2:work>
    <ns2:kindOfWork>{{model.kindOfWork}}</ns2:kindOfWork>
    {{#if (eq model.kindOfWork 6002)}}
      <ns2:energeticRestauration>{{model.energeticRestauration}}</ns2:energeticRestauration>
      <ns2:renovationHeatingsystem>{{model.renovationHeatingsystem}}</ns2:renovationHeatingsystem>
      <ns2:innerConversionRenovation>{{model.innerConversionRenovation}}</ns2:innerConversionRenovation>
      <ns2:conversion>{{model.conversion}}</ns2:conversion>
      <ns2:extensionHeighteningHeated>{{model.extensionHeighteningHeated}}</ns2:extensionHeighteningHeated>
      <ns2:extensionHeighteningNotHeated>{{model.extensionHeighteningNotHeated}}</ns2:extensionHeighteningNotHeated>
      <ns2:thermicSolarFacility>{{model.thermicSolarFacility}}</ns2:thermicSolarFacility>
      <ns2:photovoltaicSolarFacility>{{model.photovoltaicSolarFacility}}</ns2:photovoltaicSolarFacility>
      <ns2:otherWorks>{{model.otherWorks}}</ns2:otherWorks>
    {{/if}}
  </ns2:work>
  `;

  static kindOfWorkOptions = [
    6001, // Neubau
    6002, // Umbau
    6007, // Abbruch
  ];
}
