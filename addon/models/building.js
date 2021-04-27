import { tracked } from "@glimmer/tracking";

import BuildingEntrance from "./building-entrance";
import XMLModel from "./xml-model";

export default class Building extends XMLModel {
  @tracked EGID;
  @tracked nameOfBuilding;

  constructor(xmlOrObject, root = "building") {
    super(xmlOrObject);
    this.setFieldsFromXML({
      root,
      fields: {
        EGID: Number,
        nameOfBuilding: String,
        buildingEntrance: [BuildingEntrance],
      },
    });
  }

  get fullAddressTexts() {
    return (
      this.buildingEntrance?.map(
        (buildingEntrance) =>
          `${buildingEntrance.street.description.descriptionLong ?? ""} ${
            buildingEntrance.buildingEntranceNo ?? ""
          }, ${buildingEntrance.locality.swissZipCode ?? ""} ${
            buildingEntrance.locality.name.nameLong ?? ""
          }`
      ) ?? ""
    );
  }
}
