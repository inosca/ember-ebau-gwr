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

  setFieldsFromXML() {
    const simpleNumberFields = [
      "EPROID",
      "typeOfClient",
      "typeOfConstruction",
      "typeOfConstructionProject",
      "typeOfPermit",
      "totalCostsOfProject",
    ];
    simpleNumberFields.forEach((field) => {
      this[field] = this.getFieldFromXML(
        `constructionProject ${field}`,
        Number
      );
    });

    const simpleStringFields = [
      "officialConstructionProjectFileNo",
      "extensionOfOfficialConstructionProjectFileNo",
      "constructionProjectDescription",
      "constructionSurveyDept",
      "withdrawalDate",
      "projectStartDate",
      "constructionAuthorisationDeniedDate",
      "nonRealisationDate",
      "projectCompletionDate",
      "projectSuspensionDate",
      "buildingPermitIssueDate",
      "projectAnnouncementDate",
    ];
    simpleStringFields.forEach((field) => {
      this[field] = this.getFieldFromXML(`constructionProject ${field}`);
    });

    this.realestateIdentification = new RealestateIdentification(
      this.getFieldFromXML("constructionProject realestateIdentification")
    );
    this.client = new Client(
      this.getFieldFromXML("constructionProject client")
    );
    this.constructionLocalisation = new ConstructionLocalisation(
      this.getFieldFromXML("constructionProject constructionLocalisation")
    );
  }

  static template = `
  <ns2:constructionProject>
    {{#if model.isNew}}
      <ns2:officialConstructionProjectFileNo>{{model.officialConstructionProjectFileNo}}</ns2:officialConstructionProjectFileNo>
    {{/if}}

    <ns2:typeOfClient>{{model.typeOfClient}}</ns2:typeOfClient>
    <ns2:typeOfConstruction>{{model.typeOfConstruction}}</ns2:typeOfConstruction>
    <ns2:totalCostsOfProject>{{model.totalCostsOfProject}}</ns2:totalCostsOfProject>

    {{#if model.withdrawalDate}}
      <ns2:withdrawalDate>{{model.withdrawalDate}}</ns2:withdrawalDate>
    {{/if}}
    {{#if model.projectStartDate}}
      <ns2:projectStartDate>{{model.projectStartDate}}</ns2:projectStartDate>
    {{/if}}
    {{#if model.model}}
      <ns2:model>{{model.model}}</ns2:model>
    {{/if}}
    {{#if model.nonRealisationDate}}
      <ns2:nonRealisationDate>{{model.nonRealisationDate}}</ns2:nonRealisationDate>
    {{/if}}
    {{#if model.projectCompletionDate}}
      <ns2:projectCompletionDate>{{model.projectCompletionDate}}</ns2:projectCompletionDate>
    {{/if}}
    {{#if model.projectSuspensionDate}}
      <ns2:projectSuspensionDate>{{model.projectSuspensionDate}}</ns2:projectSuspensionDate>
    {{/if}}

    {{#if model.isNew}}
      <ns2:typeOfConstructionProject>{{model.typeOfConstructionProject}}</ns2:typeOfConstructionProject>
      <ns2:typeOfPermit>{{model.typeOfPermit}}</ns2:typeOfPermit>
      <ns2:constructionProjectDescription>{{model.constructionProjectDescription}}</ns2:constructionProjectDescription>
      <ns2:constructionSurveyDept>{{this.constructionSurveyDept}}</ns2:constructionSurveyDept>

      {{#if model.projectStartDate}}
        <ns2:buildingPermitIssueDate>{{model.buildingPermitIssueDate}}</ns2:buildingPermitIssueDate>
      {{/if}}

      {{#if model.projectAnnouncementDate}}
        <ns2:projectAnnouncementDate>{{model.projectAnnouncementDate}}</ns2:projectAnnouncementDate>
      {{/if}}
    {{/if}}

    {{> RealestateIdentification model=model.realestateIdentification}}
    {{> Client model=model.client}}

  </ns2:constructionProject>
  `;
}
// Stuff that returns an error from the api. Maybe can only be set on creation?
// {{#if model.projectStartDate}}
//   <ns2:buildingPermitIssueDate>{{model.buildingPermitIssueDate}}</ns2:buildingPermitIssueDate>
// {{/if}}
// {{#if model.projectAnnouncementDate}}
//   <ns2:projectAnnouncementDate>{{model.projectAnnouncementDate}}</ns2:projectAnnouncementDate>
// {{/if}}
// <ns2:typeOfConstructionProject>${this.typeOfConstructionProject}</ns2:typeOfConstructionProject>
// <ns2:typeOfPermit>${this.typeOfPermit}</ns2:typeOfPermit>
// <ns2:constructionProjectDescription>${this.constructionProjectDescription}</ns2:constructionProjectDescription>
// <ns2:constructionSurveyDept>${this.constructionSurveyDept}</ns2:constructionSurveyDept>