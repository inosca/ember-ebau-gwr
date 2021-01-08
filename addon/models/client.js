import { tracked } from "@glimmer/tracking";
import Identification from "ember-ebau-gwr/models/identification";
import Address from "ember-ebau-gwr/models/address";

import XMLModel from "./xml-model";

export default class Client extends XMLModel {
  @tracked identification = new Identification();
  @tracked address = new Address();

  static template = `
  <ns2:client>
   {{> Identification model=model.identification}}
   {{> Address model=model.address}}
  </ns2:client>
  `;
}
