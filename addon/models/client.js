import { tracked } from "@glimmer/tracking";
import Address from "ember-ebau-gwr/models/address";
import Identification from "ember-ebau-gwr/models/identification";

import XMLModel from "./xml-model";

export default class Client extends XMLModel {
  @tracked identification = new Identification();
  @tracked address = new Address();

  constructor(...args) {
    super(...args);
    this.setFieldsFromXML({
      namespace: "client",
      fields: {
        identification: Identification,
        address: Address,
      },
    });
  }

  static template = `
  <ns2:client>
   {{> Identification model=model.identification}}
   {{> Address model=model.address}}
  </ns2:client>
  `;
}
