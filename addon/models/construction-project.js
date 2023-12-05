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
  @tracked cancellationDate;
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
        extensionOfOfficialConstructionProjectFileNo: Number,
        constructionProjectDescription: String,
        constructionSurveyDeptNumber: String,
        withdrawalDate: Date,
        projectStartDate: Date,
        durationOfConstructionPhase: Number,
        constructionAuthorisationDeniedDate: Date,
        cancellationDate: Date,
        projectCompletionDate: Date,
        projectSuspensionDate: Date,
        buildingPermitIssueDate: Date,
        projectAnnouncementDate: Date,
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

    // TODO: ensure that saving all work (including those
    // with no building attached) incurs no issues
    // Do not show buildingWork which have no building attached
    /*this.work = this.work.filter(
      (buildingWork) => !buildingWork.building.isNew
    );*/

    // Project status not returned by every API response
    if (!this.projectStatus) {
      this.projectStatus = this.projectSuspensionDate
        ? this.STATUS_SUSPENDED
        : this.projectCompletionDate
          ? this.STATUS_COMPLETED
          : this.withdrawalDate
            ? this.STATUS_WITHDRAWN
            : this.cancellationDate
              ? this.STATUS_NOT_REALIZED
              : this.constructionAuthorisationDeniedDate
                ? this.STATUS_REFUSED
                : this.projectStartDate
                  ? this.STATUS_CONSTRUCTION_STARTED
                  : this.buildingPermitIssueDate
                    ? this.STATUS_APPROVED
                    : this.projectAnnouncementDate
                      ? this.STATUS_PROJECTED
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
    {{> Client model=model.client typeOfClient=model.typeOfClient}}
    <ns2:typeOfConstructionProject>{{model.typeOfConstructionProject}}</ns2:typeOfConstructionProject>
    <ns2:typeOfConstruction>{{model.typeOfConstruction}}</ns2:typeOfConstruction>
    <ns2:totalCostsOfProject>{{model.totalCostsOfProject}}</ns2:totalCostsOfProject>
    <ns2:projectAnnouncementDate>{{echDate model.projectAnnouncementDate}}</ns2:projectAnnouncementDate>

    {{{modelField model "buildingPermitIssueDate" value=(echDate model.buildingPermitIssueDate)}}}

    {{! Two seperate if / unless since the order of fields matters and projectFreeText1 and projectFreeText2 are in the middle.}}
    {{#unless model.isNew}}
      {{{modelField model "projectStartDate" value=(echDate model.projectStartDate)}}}
      {{{modelField model "projectCompletionDate" value=(echDate model.projectCompletionDate)}}}

      {{! These fields are accepted by the api but it seems like theire not actually written.}}
      {{{modelField model "projectSuspensionDate" value=(echDate model.projectSuspensionDate)}}}
      {{{modelField model "constructionAuthorisationDeniedDate" value=(echDate model.constructionAuthorisationDeniedDate)}}}

      {{! this is accepted by the api but in the response the field is missing. Is this intended?}}
      {{{modelField model "withdrawalDate" value=(echDate model.withdrawalDate)}}}
      {{{modelField model "cancellationDate" value=(echDate model.cancellationDate)}}}
      {{{modelField model "durationOfConstructionPhase"}}}
    {{/unless}}

    {{{modelField model "projectFreeText1"}}}
    {{{modelField model "projectFreeText2"}}}

    {{#if model.isNew}}
      {{#each model.work}}
        {{> BuildingWork model=this}}
      {{/each}}
    {{/if}}
  </ns2:constructionProject>
  `;

  static STATUS_PROJECTED = 6701;
  static STATUS_APPROVED = 6702;
  static STATUS_CONSTRUCTION_STARTED = 6703;
  static STATUS_COMPLETED = 6704;
  static STATUS_SUSPENDED = 6706;
  static STATUS_REFUSED = 6707;
  static STATUS_NOT_REALIZED = 6708;
  static STATUS_WITHDRAWN = 6709;

  static INFRASTRUCTURE = 6010;
  static SUPERSTRUCTURE = 6011;
  static SPECIALSTRUCTURE = 6012;

  // valid state transitions
  static projectStatesMapping = {
    [this.STATUS_PROJECTED]: [
      this.STATUS_APPROVED,
      this.STATUS_REFUSED,
      this.STATUS_WITHDRAWN,
      this.STATUS_NOT_REALIZED,
      this.STATUS_SUSPENDED,
    ], // Baugesuch eingereicht
    [this.STATUS_APPROVED]: [
      this.STATUS_CONSTRUCTION_STARTED,
      this.STATUS_WITHDRAWN,
      this.STATUS_NOT_REALIZED,
      this.STATUS_SUSPENDED,
    ], // Baubewilligung erteilt (rechtswirksam)
    [this.STATUS_CONSTRUCTION_STARTED]: [
      this.STATUS_COMPLETED,
      /*this.STATUS_NOT_REALIZED,*/ this.STATUS_SUSPENDED,
      // TODO: transition to status not realized throws error even though it
      // should be possible according to documentation
    ], // Baubegonnen
    [this.STATUS_COMPLETED]: [], // Abgeschlossen
    [this.STATUS_SUSPENDED]: [
      this.STATUS_PROJECTED,
      this.STATUS_APPROVED,
      this.STATUS_NOT_REALIZED,
      this.STATUS_CONSTRUCTION_STARTED,
    ], // Projekt sistiert
    [this.STATUS_REFUSED]: [], // Baugesuch abgelehnt (rechtswirksam)
    [this.STATUS_NOT_REALIZED]: [], // Nicht realisiert
    [this.STATUS_WITHDRAWN]: [], // Zurückgezogen
  };

  // api requests for state transitions
  static projectTransitionMapping = {
    [this.STATUS_PROJECTED]: {
      [this.STATUS_APPROVED]: "setToApprovedConstructionProject",
      [this.STATUS_REFUSED]: "setToRefusedConstructionProject",
      [this.STATUS_WITHDRAWN]: "setToWithdrawnConstructionProject",
      [this.STATUS_NOT_REALIZED]: "setToCancelledConstructionProject",
      [this.STATUS_SUSPENDED]: "setToSuspendedConstructionProject",
    },
    [this.STATUS_APPROVED]: {
      [this.STATUS_CONSTRUCTION_STARTED]: "setToStartConstructionProject",
      [this.STATUS_WITHDRAWN]: "setToWithdrawnConstructionProject",
      [this.STATUS_NOT_REALIZED]: "setToCancelledConstructionProject",
      [this.STATUS_SUSPENDED]: "setToSuspendedConstructionProject",
    },
    [this.STATUS_CONSTRUCTION_STARTED]: {
      [this.STATUS_COMPLETED]: "setToCompletedConstructionProject",
      //[this.STATUS_NOT_REALIZED]: "setToCancelledConstructionProject",
      [this.STATUS_SUSPENDED]: "setToSuspendedConstructionProject",
    },
    [this.STATUS_COMPLETED]: {},
    [this.STATUS_SUSPENDED]: {
      [this.STATUS_PROJECTED]: "setToCancelledSuspensionConstructionProject",
      [this.STATUS_APPROVED]: "setToCancelledSuspensionConstructionProject",
      [this.STATUS_NOT_REALIZED]: "setToCancelledConstructionProject",
      [this.STATUS_CONSTRUCTION_STARTED]:
        "setToCancelledSuspensionConstructionProject",
    },
    [this.STATUS_REFUSED]: {},
    [this.STATUS_NOT_REALIZED]: {},
    [this.STATUS_WITHDRAWN]: {},
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
      { field: "withdrawalDate", type: "date", required: true },
    ],
    setToCancelledConstructionProject: [
      { field: "cancellationDate", type: "date", required: true },
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
        hint: "ember-gwr.constructionProject.fields.durationOfConstructionPhase.hint",
      },
    ],
    setToCompletedConstructionProject: [
      { field: "projectCompletionDate", type: "date", required: true },
      {
        field: "realestateIdentification.number",
        type: "String",
        required: true,
      },
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
    "cancellationDate",
    "withdrawalDate",
  ];

  // necessary fields for target state in status corrections
  static projectTransitionParametersMapping = {
    [this.STATUS_PROJECTED]: [
      { field: "projectAnnouncementDate", type: "date", required: true },
    ],
    [this.STATUS_APPROVED]: [
      { field: "projectAnnouncementDate", type: "date", required: true },
      { field: "buildingPermitIssueDate", type: "date", required: true },
    ],
    [this.STATUS_CONSTRUCTION_STARTED]: [
      { field: "projectAnnouncementDate", type: "date", required: true },
      { field: "buildingPermitIssueDate", type: "date", required: true },
      { field: "projectStartDate", type: "date", required: true },
      {
        field: "durationOfConstructionPhase",
        type: "number",
        required: true,
        hint: "ember-gwr.constructionProject.fields.durationOfConstructionPhase.hint",
      },
    ],
    [this.STATUS_COMPLETED]: [
      { field: "projectAnnouncementDate", type: "date", required: true },
      { field: "buildingPermitIssueDate", type: "date", required: true },
      { field: "projectStartDate", type: "date", required: true },
      {
        field: "durationOfConstructionPhase",
        type: "number",
        required: true,
        hint: "ember-gwr.constructionProject.fields.durationOfConstructionPhase.hint",
      },
      { field: "projectCompletionDate", type: "date", required: true },
    ],
    [this.STATUS_SUSPENDED]: [
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
        hint: "ember-gwr.constructionProject.fields.durationOfConstructionPhase.hint",
      },
      {
        field: "durationOfConstructionPhase",
        type: "number",
        required: false,
        on: "projectStartDate",
        hint: "ember-gwr.constructionProject.fields.durationOfConstructionPhase.hint",
      },
      { field: "projectSuspensionDate", type: "date", required: true },
    ],
    [this.STATUS_REFUSED]: [
      { field: "projectAnnouncementDate", type: "date", required: true },
      {
        field: "constructionAuthorisationDeniedDate",
        type: "date",
        required: true,
      },
    ],
    [this.STATUS_NOT_REALIZED]: [
      { field: "projectAnnouncementDate", type: "date", required: true },
      { field: "buildingPermitIssueDate", type: "date", required: false },
      { field: "cancellationDate", type: "date", required: true },
    ],
    [this.STATUS_WITHDRAWN]: [
      { field: "projectAnnouncementDate", type: "date", required: true },
      { field: "buildingPermitIssueDate", type: "date", required: false },
      { field: "withdrawalDate", type: "date", required: true },
    ],
  };

  static transitionHint = {
    [this.STATUS_PROJECTED]: {
      [this.STATUS_APPROVED]: true,
      [this.STATUS_REFUSED]: true,
      [this.STATUS_WITHDRAWN]: true,
      [this.STATUS_NOT_REALIZED]: true,
      [this.STATUS_SUSPENDED]: false,
    },
    [this.STATUS_APPROVED]: {
      [this.STATUS_CONSTRUCTION_STARTED]: false,
      [this.STATUS_WITHDRAWN]: true,
      [this.STATUS_NOT_REALIZED]: true,
      [this.STATUS_SUSPENDED]: false,
    },
    [this.STATUS_CONSTRUCTION_STARTED]: {
      [this.STATUS_COMPLETED]: false,
      //[this.STATUS_NOT_REALIZED]: "setToCancelledConstructionProject",
      [this.STATUS_SUSPENDED]: false,
    },
    [this.STATUS_COMPLETED]: {},
    [this.STATUS_SUSPENDED]: {
      [this.STATUS_PROJECTED]: false,
      [this.STATUS_APPROVED]: false,
      [this.STATUS_NOT_REALIZED]: true,
      [this.STATUS_CONSTRUCTION_STARTED]: false,
    },
    [this.STATUS_REFUSED]: {},
    [this.STATUS_NOT_REALIZED]: {},
    [this.STATUS_WITHDRAWN]: {},
  };

  static MISSING_BUILDING_ERROR = "No link with a building found";
}
