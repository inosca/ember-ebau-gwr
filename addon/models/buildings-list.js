import { tracked } from "@glimmer/tracking";

import Building from "./building";
import BuildingEntrance from "./building-entrance";
import DateOfConstruction from "./date-of-construction";

export default class BuildingsList extends Building {
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
        }`
    );
  }
}
