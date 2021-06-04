import { tracked } from "@glimmer/tracking";

import Coordinates from "./coordinates";
import LocalId from "./local-id";
import Locality from "./locality";
import Street from "./street";
import XMLModel from "./xml-model";

export default class BuildingEntrance extends XMLModel {
  @tracked EGID;
  @tracked EGAID;
  @tracked buildingEntranceNo;
  @tracked coordinates = new Coordinates();
  @tracked isOfficialAddress;
  @tracked localId = new LocalId();
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

  get fullAddressText() {
    const { street, buildingEntranceNo, locality } = this;
    return `${street?.description.descriptionLong ?? ""} ${
      buildingEntranceNo ?? ""
    }, ${locality.swissZipCode ?? ""} ${locality.name.nameLong ?? ""}`;
  }
}
