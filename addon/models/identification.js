import { tracked } from "@glimmer/tracking";

import OrganisationIdentification from "./organisation-identification";
import PersonIdentification from "./person-identification";
import XMLModel from "./xml-model";

export default class Identification extends XMLModel {
  @tracked personIdentification = new PersonIdentification();
  @tracked organisationIdentification = new OrganisationIdentification();

  constructor(xmlOrObject, root = "identification") {
    super(xmlOrObject);
    this.setFieldsFromXML({
      root,
      fields: {
        personIdentification: PersonIdentification,
        organisationIdentification: OrganisationIdentification,
      },
    });
  }

  static template = `
  <identification>
    {{#if (eq typeOfClient 6161)}}
      {{> PersonIdentification model=model.personIdentification}}
    {{else}}
      {{> OrganisationIdentification model=model.organisationIdentification}}
    {{/if}}
  </identification>
  `;
}
