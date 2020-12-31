import { tracked } from "@glimmer/tracking";

export default class Address {
  @tracked street;
  @tracked houseNumber;
  @tracked swissZipCode;
  @tracked town;
  @tracked country;
}
