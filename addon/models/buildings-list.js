import { tracked } from "@glimmer/tracking";

import BuildingEntrance from "./building-entrance";
import DateOfConstruction from "./date-of-construction";
import XMLModel from "./xml-model";

export default class BuildingsList extends XMLModel {
  @tracked EGID;
  @tracked buildingEntrance = [];
  @tracked dateOfConstruction = new DateOfConstruction();

  constructor(xmlOrObject, root = "buildingsList") {
    super(xmlOrObject);
    this.setFieldsFromXML({
      root,
      fields: {
        EGID: Number,
        buildingEntrance: [BuildingEntrance],
        dateOfConstruction: DateOfConstruction,
      },
    });
  }

  get fullAddressTexts() {
    return this.buildingEntrance.map(
      (buildingEntrance) =>
        `${buildingEntrance.street.description.descriptionLong ?? ""} ${
          buildingEntrance.buildingEntranceNo ?? ""
        }, ${buildingEntrance.locality.swissZipCode ?? ""} ${
          buildingEntrance.locality.name.nameLong ?? ""
        }`,
    );
  }
}
