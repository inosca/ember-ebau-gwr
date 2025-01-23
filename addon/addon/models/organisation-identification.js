import { tracked } from "@glimmer/tracking";

import XMLModel from "./xml-model";

export class LocalOrganisationId extends XMLModel {
  @tracked organisationIdCategory = "CHE";
  @tracked organisationId;

  constructor(...args) {
    super(...args);
    this.setFieldsFromXML({
      fields: {
        organisationIdCategory: Number,
        organisationId: Number,
      },
    });
  }

  static template = `
  {{!--TODO: Dummy values to prevent API errors. The API ignores whatever values
    are entered and returns N/A. But throws an error if localOrganisationId isn't sent.
    Remove once no longer required by API--}}
  <ns3:localOrganisationId>
    <ns3:organisationIdCategory>-</ns3:organisationIdCategory>
    <ns3:organisationId>-</ns3:organisationId>
  </ns3:localOrganisationId>
  `;
}

export default class OrganisationIdentification extends XMLModel {
  @tracked organisationName;
  @tracked organisationAdditionalName;

  @tracked localOrganisationId = new LocalOrganisationId();

  constructor(...args) {
    super(...args);
    this.setFieldsFromXML({
      fields: {
        organisationName: String,
        organisationAdditionalName: String,
        localOrganisationId: LocalOrganisationId,
      },
    });
  }

  static template = `
  <organisationIdentification>
    {{> LocalOrganisationId model=model.localOrganisationId}}

    <ns3:organisationName>{{model.organisationName}}</ns3:organisationName>
    {{{modelField model "organisationAdditionalName" namespace="ns3:"}}}
  </organisationIdentification>
  `;
}
