import { tracked } from "@glimmer/tracking";

import Street from "./street";
import Locality from "./locality";
import XMLModel from "./xml-model";

export default class BuildingEntrance extends XMLModel {
  @tracked EGID;
  @tracked EGAID;
  @tracked buildingEntranceNo;
  @tracked isOfficialAddress;
  @tracked street = new Street();
  @tracked locality = new Locality();

  constructor(xmlOrObject) {
    super(xmlOrObject);
    this.setFieldsFromXML({
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
