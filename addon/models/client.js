import { tracked } from "@glimmer/tracking";
import Identification from "ember-ebau-gwr/models/identification";
import Address from "ember-ebau-gwr/models/address";

export default class Client {
  @tracked identification = new Identification();
  @tracked address = new Address();
}
