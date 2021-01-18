import { tracked } from "@glimmer/tracking";

import Client from "./client";
import ConstructionLocalisation from "./construction-localisation";
import RealestateIdentification from "./realestate-identification";
import XMLModel from "./xml-model";

export default class ConstructionProject extends XMLModel {
  @tracked EPROID;
  @tracked officialConstructionProjectFileNo;
  @tracked extensionOfOfficialConstructionProjectFileNo;

  @tracked typeOfClient;
  @tracked typeOfConstruction;
  @tracked typeOfConstructionProject;
  @tracked typeOfPermit;

  @tracked constructionProjectDescription;
  @tracked projectFreeText1;
  @tracked projectFreeText2;
  @tracked constructionProjectDescription;
  @tracked totalCostsOfProject;
  @tracked constructionSurveyDept;

  @tracked withdrawalDate;
  @tracked projectStartDate;
  @tracked constructionAuthorisationDeniedDate;
  @tracked nonRealisationDate;
  @tracked projectCompletionDate;
  @tracked projectSuspensionDate;
  @tracked buildingPermitIssueDate;
  @tracked projectAnnouncementDate;

  @tracked realestateIdentification = new RealestateIdentification();
  @tracked client = new Client();
  @tracked constructionLocalisation = new ConstructionLocalisation();

  constructor(...args) {
    super(...args);
    this.setFieldsFromXML({
      namespace: "constructionProject",
      fields: {
        EPROID: Number,
        typeOfClient: Number,
        typeOfConstruction: Number,
        typeOfConstructionProject: Number,
        typeOfPermit: Number,
        totalCostsOfProject: Number,
        officialConstructionProjectFileNo: String,
        extensionOfOfficialConstructionProjectFileNo: String,
        constructionProjectDescription: String,
        constructionSurveyDept: String,
        withdrawalDate: String,
        projectStartDate: String,
        constructionAuthorisationDeniedDate: String,
        nonRealisationDate: String,
        projectCompletionDate: String,
        projectSuspensionDate: String,
        buildingPermitIssueDate: String,
        projectAnnouncementDate: String,
        projectFreeText1: String,
        projectFreeText2: String,
        realestateIdentification: RealestateIdentification,
        client: Client,
        constructionLocalisation: ConstructionLocalisation,
      },
    });
  }
  //TODO merge these two templates but for now keep them seperate for easier testing and figuring out how the api works.
  // The order of the fields seems to be important. Sometimes fields in wrong orders throw errors.
  static template = `
  {{#if model.isNew}}
  <ns2:constructionProject>
    <ns2:constructionSurveyDept>{{model.constructionSurveyDept}}</ns2:constructionSurveyDept>
    <ns2:constructionProjectDescription>{{model.constructionProjectDescription}}</ns2:constructionProjectDescription>
    {{> ConstructionLocalisation model=model.constructionLocalisation}}
    {{! this is accepted by the api but in the response the field is missing. Is this intended?}}
    {{> RealestateIdentification model=model.realestateIdentification}}
    <ns2:typeOfPermit>{{model.typeOfPermit}}</ns2:typeOfPermit>
    <ns2:typeOfClient>{{model.typeOfClient}}</ns2:typeOfClient>
    <ns2:typeOfConstructionProject>{{model.typeOfConstructionProject}}</ns2:typeOfConstructionProject>
    <ns2:totalCostsOfProject>{{model.totalCostsOfProject}}</ns2:totalCostsOfProject>
    <ns2:projectAnnouncementDate>{{echDate model.projectAnnouncementDate}}</ns2:projectAnnouncementDate>


    {{!--
    These fields return errors which i have not figured out yet.
    {{> Client model=model.client}}
    --}}

    <ns2:buildingProjectLink>
      <ns2:kindOfWork>6002</ns2:kindOfWork>
    </ns2:buildingProjectLink>

  </ns2:constructionProject>
  {{else}}
  <ns2:constructionProject>
    <ns2:constructionSurveyDept>{{model.constructionSurveyDept}}</ns2:constructionSurveyDept>
    <ns2:constructionProjectDescription>{{model.constructionProjectDescription}}</ns2:constructionProjectDescription>
    <ns2:typeOfPermit>{{model.typeOfPermit}}</ns2:typeOfPermit>
    <ns2:typeOfClient>{{model.typeOfClient}}</ns2:typeOfClient>
    <ns2:typeOfConstructionProject>{{model.typeOfConstructionProject}}</ns2:typeOfConstructionProject>
    <ns2:totalCostsOfProject>{{model.totalCostsOfProject}}</ns2:totalCostsOfProject>
    <ns2:projectAnnouncementDate>{{echDate model.projectAnnouncementDate}}</ns2:projectAnnouncementDate>

    {{#if model.buildingPermitIssueDate}}
      <ns2:buildingPermitIssueDate>{{echDate model.buildingPermitIssueDate}}</ns2:buildingPermitIssueDate>
    {{/if}}
    {{#if model.projectStartDate}}
      <ns2:projectStartDate>{{echDate model.projectStartDate}}</ns2:projectStartDate>
    {{/if}}
    {{#if model.projectCompletionDate}}
      <ns2:projectCompletionDate>{{echDate model.projectCompletionDate}}</ns2:projectCompletionDate>
    {{/if}}

    {{! These fields are accepted by the api but it seems like theire not actually written.}}
    {{#if model.projectSuspensionDate}}
      <ns2:projectSuspensionDate>{{echDate model.projectSuspensionDate}}</ns2:projectSuspensionDate>
    {{/if}}
    {{#if model.constructionAuthorisationDeniedDate}}
      <ns2:constructionAuthorisationDeniedDate>{{echDate model.constructionAuthorisationDeniedDate}}</ns2:constructionAuthorisationDeniedDate>
    {{/if}}
    {{#if model.withdrawalDate}}
      <ns2:withdrawalDate>{{echDate model.withdrawalDate}}</ns2:withdrawalDate>
    {{/if}}

    {{!--
    These fields cause errors as of this comment:

    {{#if model.nonRealisationDate}}
      <ns2:nonRealisationDate>{{echDate model.nonRealisationDate}}</ns2:nonRealisationDate>
    {{/if}}
    {{> Client model=model.client}}
    {{> ConstructionLocalisation model=model.constructionLocalisation}}
    {{> RealestateIdentification model=model.realestateIdentification}}
    --}}
  </ns2:constructionProject>
  {{/if}}
  `;
}
