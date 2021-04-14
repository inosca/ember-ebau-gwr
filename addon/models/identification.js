import { tracked } from "@glimmer/tracking";

import OrganisationIdentification from "./organisation-identification";
import PersonIdentification from "./person-identification";
import XMLModel from "./xml-model";

export default class Identification extends XMLModel {
  @tracked personIdentification = new PersonIdentification();
  @tracked organisationIdentification = new OrganisationIdentification();

  // This is not a field in the gwr data model. We use this for state
  // tracking and to decide which identification type should be used.
  @tracked _isOrganisation = false;
  get isOrganisation() {
    return (
      this._isOrganisation ??
      Boolean(this.organisationIdentification.organisationName)
    );
  }

  set isOrganisation(value) {
    this._isOrganisation = value;
  }

  constructor(xmlOrObject, root = "identification") {
    super(xmlOrObject);
    this.setFieldsFromXML({
      root,
      fields: {
        personIdentification: PersonIdentification,
      },
    });
  }

  static template = `
  <identification>
    {{#if model.isOrganisation}}
      {{> OrganisationIdentification model=model.organisationIdentification}}
    {{else}}
      {{> PersonIdentification model=model.personIdentification}}
    {{/if}}
  </identification>
  `;
}
