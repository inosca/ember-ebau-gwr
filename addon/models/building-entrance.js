import { tracked } from "@glimmer/tracking";

import Locality from "./locality";
import Street from "./street";
import XMLModel from "./xml-model";

export default class BuildingEntrance extends XMLModel {
  @tracked EGID;
  @tracked EGAID;
  @tracked buildingEntranceNo;
  @tracked isOfficialAddress;
  @tracked street = new Street();
  @tracked locality = new Locality();

  constructor(xmlOrObject, root = "buildingEntrance") {
    super(xmlOrObject);
    this.setFieldsFromXML({
      root,
      fields: {
        EGID: Number,
        EGAID: Number,
        buildingEntranceNo: String,
        isOfficialAddress: Boolean,
        street: Street,
        locality: Locality,
      },
    });
  }
}
