import { tracked } from "@glimmer/tracking";

import BuildingWork from "./building-work";
import Client from "./client";
import ConstructionLocalisation from "./construction-localisation";
import ErrorList from "./error-list";
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
  @tracked totalCostsOfProject;
  @tracked constructionSurveyDeptNumber;

  @tracked withdrawalDate;
  @tracked projectStartDate;
  @tracked durationOfConstructionPhase;
  @tracked constructionAuthorisationDeniedDate;
  @tracked nonRealisationDate;
  @tracked projectCompletionDate;
  @tracked projectSuspensionDate;
  @tracked buildingPermitIssueDate;
  @tracked projectAnnouncementDate;

  @tracked realestateIdentification = new RealestateIdentification();
  @tracked client = new Client();
  @tracked constructionLocalisation = new ConstructionLocalisation();
  @tracked work = [];

  @tracked projectStatus;
  @tracked errorList = [];

  constructor(xmlOrObject, root = "constructionProject") {
    super(xmlOrObject);
    this.setFieldsFromXML({
      root,
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
        constructionSurveyDeptNumber: String,
        withdrawalDate: String,
        projectStartDate: String,
        durationOfConstructionPhase: Number,
        constructionAuthorisationDeniedDate: String,
        nonRealisationDate: String,
        projectCompletionDate: String,
        projectSuspensionDate: String,
        buildingPermitIssueDate: String,
        projectAnnouncementDate: String,
        projectFreeText1: String,
        projectFreeText2: String,
        projectStatus: Number,
        realestateIdentification: RealestateIdentification,
        client: Client,
        constructionLocalisation: ConstructionLocalisation,
        work: [BuildingWork],
      },
    });

    this.setFieldsFromXML({
      fields: {
        errorList: [ErrorList],
      },
    });

    // Do not show buildingWork which have no building attached
    this.work = this.work.filter(
      (buildingWork) => !buildingWork.building.isNew
    );

    // Project status not returned by every API response
    if (!this.projectStatus) {
      this.projectStatus = this.projectSuspensionDate
        ? 6706
        : this.projectCompletionDate
        ? 6704
        : this.withdrawalDate
        ? 6709
        : this.nonRealisationDate
        ? 6708
        : this.constructionAuthorisationDeniedDate
        ? 6707
        : this.projectStartDate
        ? 6703
        : this.buildingPermitIssueDate
        ? 6702
        : this.projectAnnouncementDate
        ? 6701
        : undefined;
    }
  }
  // The order of the fields seems to be important. Sometimes fields in wrong orders throw errors.
  // TODO <work> is until now a fixed value. We need to implement a select for it and display it.
  static template = `
  <ns2:constructionProject>
    {{{modelField model "officialConstructionProjectFileNo"}}}
    {{{modelField model "extensionOfOfficialConstructionProjectFileNo"}}}
    <ns2:constructionSurveyDeptNumber>{{model.constructionSurveyDeptNumber}}</ns2:constructionSurveyDeptNumber>
    <ns2:constructionProjectDescription>{{model.constructionProjectDescription}}</ns2:constructionProjectDescription>
    {{> ConstructionLocalisation model=model.constructionLocalisation}}
    {{> RealestateIdentification model=model.realestateIdentification}}
    <ns2:typeOfPermit>{{model.typeOfPermit}}</ns2:typeOfPermit>
    <ns2:typeOfClient>{{model.typeOfClient}}</ns2:typeOfClient>
    {{! this is accepted by the api but in the response the field is missing. Is this intended?}}
    {{> Client model=model.client}}
    <ns2:typeOfConstructionProject>{{model.typeOfConstructionProject}}</ns2:typeOfConstructionProject>
    <ns2:typeOfConstruction>{{model.typeOfConstruction}}</ns2:typeOfConstruction>
    <ns2:totalCostsOfProject>{{model.totalCostsOfProject}}</ns2:totalCostsOfProject>
    <ns2:projectAnnouncementDate>{{echDate model.projectAnnouncementDate}}</ns2:projectAnnouncementDate>

    {{{modelField model "buildingPermitIssueDate" value=(echDate model.buildingPermitIssueDate)}}}

    {{#unless model.isNew}}
      {{{modelField model "projectStartDate" value=(echDate model.projectStartDate)}}}
      {{{modelField model "projectCompletionDate" value=(echDate model.projectCompletionDate)}}}

      {{! These fields are accepted by the api but it seems like theire not actually written.}}
      {{{modelField model "projectSuspensionDate" value=(echDate model.projectSuspensionDate)}}}
      {{{modelField model "constructionAuthorisationDeniedDate" value=(echDate model.constructionAuthorisationDeniedDate)}}}

      {{! this is accepted by the api but in the response the field is missing. Is this intended?}}
      {{{modelField model "withdrawalDate" value=(echDate model.withdrawalDate)}}}
      {{{modelField model "cancellationDate" value=(echDate model.nonRealisationDate)}}}
      {{{modelField model "durationOfConstructionPhase"}}}
    {{/unless}}

    {{#if model.isNew}}
      <ns2:work>
        <ns2:kindOfWork>6002</ns2:kindOfWork>
        <ns2:ARBID>1</ns2:ARBID>
      </ns2:work>
    {{/if}}
  </ns2:constructionProject>
  `;

  // valid state transitions
  static projectStatesMapping = {
    6701: [6702, 6707, 6709, 6708, 6706], // Baugesuch eingereicht
    6702: [6703, 6709, 6708, 6706], // Baubewilligung erteilt (rechtswirksam)
    6703: [6704, 6708, 6706], // Baubegonnen
    6704: [], // Abgeschlossen
    6706: [6701, 6702, 6708, 6703], // Projekt sistiert
    6707: [], // Baugesuch abgelehnt (rechtswirksam)
    6708: [], // Nicht realisiert
    6709: [], // Zurückgezogen
  };

  // api requests for state transitions
  static projectTransitionMapping = {
    6701: {
      6702: "setToApprovedConstructionProject",
      6707: "setToRefusedConstructionProject",
      6709: "setToCancelledConstructionProject",
      6708: "setToWithdrawnConstructionProject",
      6706: "setToSuspendedConstructionProject",
    },
    6702: {
      6703: "setToStartConstructionProject",
      6709: "setToCancelledConstructionProject",
      6708: "setToWithdrawnConstructionProject",
      6706: "setToSuspendedConstructionProject",
    },
    6703: {
      6704: "setToCompletedConstructionProject",
      6708: "setToWithdrawnConstructionProject",
      6706: "setToSuspendedConstructionProject",
    },
    6704: {},
    6706: {
      6701: "setToCancelledSuspensionConstructionProject",
      6702: "setToCancelledSuspensionConstructionProject",
      6708: "setToWithdrawnConstructionProject",
      6703: "setToCancelledSuspensionConstructionProject",
    },
    6707: {},
    6708: {},
    6709: {},
  };

  // necessary parameters for status transitions in status changes
  static projectTransitionParameters = {
    setToApprovedConstructionProject: [
      { field: "buildingPermitIssueDate", type: "date", required: true },
    ],
    setToRefusedConstructionProject: [
      {
        field: "constructionAuthorisationDeniedDate",
        type: "date",
        required: true,
      },
    ],
    setToWithdrawnConstructionProject: [
      { field: "nonRealisationDate", type: "date", required: true },
    ],
    setToCancelledConstructionProject: [
      { field: "withdrawalDate", type: "date", required: true },
    ],
    setToSuspendedConstructionProject: [
      { field: "projectSuspensionDate", type: "date", required: true },
    ],
    setToStartConstructionProject: [
      { field: "projectStartDate", type: "date", required: true },
      {
        field: "durationOfConstructionPhase",
        type: "number",
        required: true,
        hint:
          "ember-gwr.constructionProject.fields.durationOfConstructionPhase.hint",
      },
    ],
    setToCompletedConstructionProject: [
      { field: "projectCompletionDate", type: "date", required: true },
    ],
    setToCancelledSuspensionConstructionProject: [],
  };

  // possible status parameters
  static statusParameters = [
    "projectAnnouncementDate",
    "buildingPermitIssueDate",
    "projectStartDate",
    "projectCompletionDate",
    "projectSuspensionDate",
    "constructionAuthorisationDeniedDate",
    "nonRealisationDate",
    "withdrawalDate",
  ];

  // necessary fields for target state in status corrections
  static projectTransitionParametersMapping = {
    6701: [{ field: "projectAnnouncementDate", type: "date", required: true }],
    6702: [
      { field: "projectAnnouncementDate", type: "date", required: true },
      { field: "buildingPermitIssueDate", type: "date", required: true },
    ],
    6703: [
      { field: "projectAnnouncementDate", type: "date", required: true },
      { field: "buildingPermitIssueDate", type: "date", required: true },
      { field: "projectStartDate", type: "date", required: true },
      {
        field: "durationOfConstructionPhase",
        type: "number",
        required: true,
        hint:
          "ember-gwr.constructionProject.fields.durationOfConstructionPhase.hint",
      },
    ],
    6704: [
      { field: "projectAnnouncementDate", type: "date", required: true },
      { field: "buildingPermitIssueDate", type: "date", required: true },
      { field: "projectStartDate", type: "date", required: true },
      {
        field: "durationOfConstructionPhase",
        type: "number",
        required: true,
        hint:
          "ember-gwr.constructionProject.fields.durationOfConstructionPhase.hint",
      },
      { field: "projectCompletionDate", type: "date", required: true },
    ],
    6706: [
      { field: "projectAnnouncementDate", type: "date", required: true },
      {
        field: "buildingPermitIssueDate",
        type: "date",
        required: false,
        on: "projectStartDate",
      },
      {
        field: "projectStartDate",
        type: "date",
        required: false,
        on: "durationOfConstructionPhase",
        hint:
          "ember-gwr.constructionProject.fields.durationOfConstructionPhase.hint",
      },
      {
        field: "durationOfConstructionPhase",
        type: "number",
        required: false,
        on: "projectStartDate",
        hint:
          "ember-gwr.constructionProject.fields.durationOfConstructionPhase.hint",
      },
      { field: "projectSuspensionDate", type: "date", required: true },
    ],
    6707: [
      { field: "projectAnnouncementDate", type: "date", required: true },
      {
        field: "constructionAuthorisationDeniedDate",
        type: "date",
        required: true,
      },
    ],
    6708: [
      { field: "projectAnnouncementDate", type: "date", required: true },
      { field: "buildingPermitIssueDate", type: "date", required: false },
      { field: "nonRealisationDate", type: "date", required: true },
    ],
    6709: [
      { field: "projectAnnouncementDate", type: "date", required: true },
      { field: "buildingPermitIssueDate", type: "date", required: false },
      { field: "withdrawalDate", type: "date", required: true },
    ],
  };
}
