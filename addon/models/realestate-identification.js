import { tracked } from "@glimmer/tracking";

export default class RealestateIdentification {
  @tracked number;
  @tracked EGRID;
  @tracked numberSuffix;
  @tracked subDistrict;
  @tracked lot;
}
