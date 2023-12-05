import { tracked } from "@glimmer/tracking";

import BuildingEntrance from "./building-entrance";
import Coordinates from "./coordinates";
import DateOfConstruction from "./date-of-construction";
import ErrorList from "./error-list";
import LocalId from "./local-id";
import RealestateIdentification from "./realestate-identification";
import ThermotechnicalDeviceForHeating from "./thermotechnical-device-for-heating";
import ThermotechnicalDeviceForWarmWater from "./thermotechnical-device-for-warm-water";
import XMLModel from "./xml-model";

export default class Building extends XMLModel {
  @tracked EGID;
  @tracked municipality;
  @tracked officialBuildingNo;
  @tracked nameOfBuilding;
  @tracked coordinates = new Coordinates();
  @tracked realestateIdentification = new RealestateIdentification();
  @tracked localCode1;
  @tracked localCode2;
  @tracked localCode3;
  @tracked localCode4;
  @tracked neighbourhood;
  @tracked buildingStatus;
  @tracked buildingCategory;
  @tracked buildingClass;
  @tracked dateOfConstruction = new DateOfConstruction();
  @tracked yearOfDemolition;
  @tracked surfaceAreaOfBuilding;
  @tracked volume = new Volume();
  @tracked numberOfFloors;
  @tracked numberOfSeparateHabitableRooms;
  @tracked civilDefenseShelter = false;
  @tracked energyRelevantSurface;
  @tracked
  thermotechnicalDeviceForHeating1 = new ThermotechnicalDeviceForHeating1();
  @tracked
  thermotechnicalDeviceForHeating2 = new ThermotechnicalDeviceForHeating2();
  @tracked
  thermotechnicalDeviceForWarmWater1 = new ThermotechnicalDeviceForWarmWater1();
  @tracked
  thermotechnicalDeviceForWarmWater2 = new ThermotechnicalDeviceForWarmWater2();
  @tracked buildingFreeText1;
  @tracked buildingFreeText2;
  @tracked localId = [];
  @tracked buildingEntrance = [];

  @tracked errorList;

  constructor(xmlOrObject, root = "building") {
    super(xmlOrObject);
    this.setFieldsFromXML({
      root,
      fields: {
        EGID: Number,
        municipality: Number,
        officialBuildingNo: Number,
        nameOfBuilding: String,
        coordinates: Coordinates,
        realestateIdentification: RealestateIdentification,
        localCode1: String,
        localCode2: String,
        localCode3: String,
        localCode4: String,
        neighbourhood: Number,
        buildingStatus: Number,
        buildingCategory: Number,
        buildingClass: Number,
        dateOfConstruction: DateOfConstruction,
        yearOfDemolition: Number,
        surfaceAreaOfBuilding: Number,
        volume: Volume,
        numberOfFloors: Number,
        numberOfSeparateHabitableRooms: Number,
        civilDefenseShelter: Boolean,
        energyRelevantSurface: Number,
        thermotechnicalDeviceForHeating1: ThermotechnicalDeviceForHeating1,
        thermotechnicalDeviceForHeating2: ThermotechnicalDeviceForHeating2,
        thermotechnicalDeviceForWarmWater1: ThermotechnicalDeviceForWarmWater1,
        thermotechnicalDeviceForWarmWater2: ThermotechnicalDeviceForWarmWater2,
        buildingFreeText1: String,
        buildingFreeText2: String,
        localId: [LocalId],
        buildingEntrance: [BuildingEntrance],
      },
    });

    this.setFieldsFromXML({
      fields: {
        errorList: [ErrorList],
      },
    });
  }

  get fullAddressTexts() {
    return this.buildingEntrance?.map(
      (buildingEntrance) => buildingEntrance.fullAddressText,
    );
  }

  static template = `
  <ns2:building>
    <ns2:municipality>{{model.municipality}}</ns2:municipality>
    {{#if model.officialBuildingNo}}
      <ns2:officialBuildingNo>{{model.officialBuildingNo}}</ns2:officialBuildingNo>
    {{/if}}
    {{#if model.nameOfBuilding}}
      <ns2:nameOfBuilding>{{model.nameOfBuilding}}</ns2:nameOfBuilding>
    {{/if}}
    {{> Coordinates model=model.coordinates}}
    {{> RealestateIdentification model=model.realestateIdentification}}
    {{#if model.localCode1}}
      <ns2:localCode1>{{model.localCode1}}</ns2:localCode1>
    {{/if}}
    {{#if model.localCode2}}
      <ns2:localCode2>{{model.localCode2}}</ns2:localCode2>
    {{/if}}
    {{#if model.localCode3}}
      <ns2:localCode3>{{model.localCode3}}</ns2:localCode3>
    {{/if}}
    {{#if model.localCode4}}
      <ns2:localCode4>{{model.localCode4}}</ns2:localCode4>
    {{/if}}
    {{#if model.neighbourhood}}
      <ns2:neighbourhood>{{model.neighbourhood}}</ns2:neighbourhood>
    {{/if}}
    <ns2:buildingStatus>{{model.buildingStatus}}</ns2:buildingStatus>
    <ns2:buildingCategory>{{model.buildingCategory}}</ns2:buildingCategory>
    {{#if model.buildingClass}}
      <ns2:buildingClass>{{model.buildingClass}}</ns2:buildingClass>
    {{/if}}
    {{> DateOfConstruction model=model.dateOfConstruction}}
    {{! Returns no error but not saved by api}}
    {{#if model.yearOfDemolition}}
      <ns2:yearOfDemolition>{{model.yearOfDemolition}}</ns2:yearOfDemolition>
    {{/if}}
    {{#if model.surfaceAreaOfBuilding}}
      <ns2:surfaceAreaOfBuilding>{{model.surfaceAreaOfBuilding}}</ns2:surfaceAreaOfBuilding>
    {{/if}}

    {{! TODO remove this once we have real validation}}
    {{#if (and model.volume.volume model.volume.norm)}}
      {{> Volume model=model.volume}}
    {{/if}}
    {{#if model.numberOfFloors}}
      <ns2:numberOfFloors>{{model.numberOfFloors}}</ns2:numberOfFloors>
    {{/if}}
    {{{modelField model "numberOfSeparateHabitableRooms" renderZero=false}}}
    {{! Returns no error but not saved by api}}
    {{{modelField model "civilDefenseShelter"}}}
    {{#if model.energyRelevantSurface}}
      <ns2:energyRelevantSurface>{{model.energyRelevantSurface}}</ns2:energyRelevantSurface>
    {{/if}}

    {{> ThermotechnicalDeviceForHeating model=model.thermotechnicalDeviceForHeating1 tagName="thermotechnicalDeviceForHeating1"}}
    {{> ThermotechnicalDeviceForHeating model=model.thermotechnicalDeviceForHeating2 tagName="thermotechnicalDeviceForHeating2"}}
    {{> ThermotechnicalDeviceForWarmWater model=model.thermotechnicalDeviceForWarmWater1 tagName="thermotechnicalDeviceForWarmWater1"}}
    {{> ThermotechnicalDeviceForWarmWater model=model.thermotechnicalDeviceForWarmWater2 tagName="thermotechnicalDeviceForWarmWater2"}}

    {{#if model.buildingFreeText1}}
      <ns2:buildingFreeText1>{{model.buildingFreeText1}}</ns2:buildingFreeText1>
    {{/if}}
    {{#if model.buildingFreeText2}}
      <ns2:buildingFreeText2>{{model.buildingFreeText2}}</ns2:buildingFreeText2>
    {{/if}}

    {{#if model.isNew}}
      {{!--The default building entrance on a new building is stored as a single
         element to facilitate form validation--}}
      {{!--After building creation the building entrances are stored in an
         array on the building and handled through building entrance API requests--}}
      <ns2:buildingEntrance>
        {{> BuildingEntrance model=model.buildingEntrance}}
      </ns2:buildingEntrance>
    {{/if}}
  </ns2:building>
`;

  static buildingStatusOptions = [
    1001, // Projektiert
    1002, // Bewilligt
    1003, // Im Bau
    1004, // Bestehend
    1005, // Nicht nutzbar
    1007, // Abgebrochen
    1008, // Nicht realisiert
  ];

  static buildingCategoryOptions = [
    1010, // Provisorische Unterkunft
    1020, // Reine Wohngebäude (Wohnnutzung ausschliesslich)
    1030, // Wohngebäude mit Nebennutzung
    1040, // Gebäude mit teilweiser Wohnnutzung
    1060, // Gebäude ohne Wohnnutzung
    1080, // Sonderbau
  ];

  static buildingClassOptions = [
    1110, //  Gebäude mit einer Wohnung
    1121, // Gebäude mit zwei Wohnungen
    1122, // Gebäude mit drei oder mehr Wohnungen
    1130, // Wohngebäude für Gemeinschaften
    1211, // Hotelgebäude
    1212, // Andere Gebäude für kurzfristige Beherbergungen
    1220, // Bürogebäude
    1230, // Gross- und Einzelhandelsgebäude
    1231, // Restaurants und Bars in Gebäuden ohne Wohnnutzung
    1241, // Bahnhöfe, Abfertigungsgebäude, Fernsprechvermittlungszentralen
    1242, // Garagengebäude
    1251, // Industriegebäude
    1252, // Behälter, Silos und Lagergebäude
    1261, // Gebäude für Kultur- und Freizeitzwecke
    1262, // Museen / Bibliotheken
    1263, // Schul- und Hochschulgebäude, Forschungseinrichtungen
    1264, // Krankenhäuser und Facheinrichtungen des Gesundheitswesens
    1265, // Sporthallen
    1271, // Landwirtschaftliche Betriebsgebäude
    1272, // Kirchen und sonstige Kultgebäude
    1273, // Denkmäler oder unter Denkmalschutz stehende Bauwerke
    1274, // Sonstige Hochbauten, anderweitig nicht genannt
    1275, // Andere Gebäude für die kollektive Unterkunft
    1276, // Gebäude für die Tierhaltung
    1277, // Gebäude für den Pflanzenbau
    1278, // Andere landwirtschaftliche Gebäude
  ];

  static STATUS_PROJECTED = 1001;
  static STATUS_APPROVED = 1002;
  static STATUS_CONSTRUCTION_STARTED = 1003;
  static STATUS_COMPLETED = 1004;
  static STATUS_UNUSABLE = 1005;
  static STATUS_DEMOLISHED = 1007;
  static STATUS_NOT_REALIZED = 1008;

  // valid state transitions
  static buildingStatesMapping = {
    [this.STATUS_PROJECTED]: [this.STATUS_APPROVED, this.STATUS_NOT_REALIZED], // Projektiert
    [this.STATUS_APPROVED]: [
      this.STATUS_CONSTRUCTION_STARTED,
      this.STATUS_NOT_REALIZED,
    ], // Bewilligt
    [this.STATUS_CONSTRUCTION_STARTED]: [
      this.STATUS_COMPLETED,
      this.STATUS_UNUSABLE,
    ], // Im Bau
    [this.STATUS_COMPLETED]: [this.STATUS_DEMOLISHED], // Bestehend
    [this.STATUS_UNUSABLE]: [this.STATUS_COMPLETED, this.STATUS_DEMOLISHED], // Nicht nutzbar
    [this.STATUS_DEMOLISHED]: [], // Abgebrochen
    [this.STATUS_NOT_REALIZED]: [], // Nicht realisiert
  };

  // api requests for state transitions
  static buildingTransitionMapping = {
    [this.STATUS_PROJECTED]: {
      [this.STATUS_APPROVED]: "setToApprovedBuilding",
      [this.STATUS_NOT_REALIZED]: "setToNotRealizedBuilding",
    },
    [this.STATUS_APPROVED]: {
      [this.STATUS_CONSTRUCTION_STARTED]: "setToBuildingConstructionStarted",
      [this.STATUS_NOT_REALIZED]: "setToNotRealizedBuilding",
    },
    [this.STATUS_CONSTRUCTION_STARTED]: {
      [this.STATUS_COMPLETED]: "setToCompletedBuilding",
      [this.STATUS_UNUSABLE]: "setToUnusableBuilding",
    },
    [this.STATUS_COMPLETED]: {
      [this.STATUS_DEMOLISHED]: "setToDemolishedBuilding",
    },
    [this.STATUS_UNUSABLE]: {
      [this.STATUS_COMPLETED]: "setToCompletedBuilding",
      [this.STATUS_DEMOLISHED]: "setToDemolishedBuilding",
    },
    [this.STATUS_DEMOLISHED]: {},
    [this.STATUS_NOT_REALIZED]: {},
  };

  // possible status parameters
  static statusParameters = [
    "dateOfConstruction.yearMonthDay",
    "yearOfDemolition",
  ];

  // necessary parameters for status transitions in status changes
  static buildingTransitionParameters = {
    setToApprovedBuilding: [],
    setToCompletedBuilding: [
      {
        field: "dateOfConstruction.yearMonthDay",
        type: "date",
        required: true,
      },
    ],
    setToDemolishedBuilding: [
      { field: "yearOfDemolition", type: "number", required: true },
    ],
    setToNotRealizedBuilding: [],
    setToBuildingConstructionStarted: [],
    setToUnusableBuilding: [],
  };

  // necessary fields for target state in status corrections
  static buildingTransitionParametersMapping = {
    [this.STATUS_PROJECTED]: [],
    [this.STATUS_APPROVED]: [],
    [this.STATUS_CONSTRUCTION_STARTED]: [],
    [this.STATUS_COMPLETED]: [
      {
        field: "dateOfConstruction.yearMonthDay",
        type: "date",
        required: true,
      },
    ],
    [this.STATUS_UNUSABLE]: [],
    [this.STATUS_DEMOLISHED]: [
      {
        field: "dateOfConstruction.yearMonthDay",
        type: "date",
        required: false,
      },
      { field: "yearOfDemolition", type: "number", required: true },
    ],
    [this.STATUS_NOT_REALIZED]: [],
  };

  static transitionHint = {
    [this.STATUS_PROJECTED]: {
      [this.STATUS_APPROVED]: true,
      [this.STATUS_NOT_REALIZED]: true,
    },
    [this.STATUS_APPROVED]: {
      [this.STATUS_CONSTRUCTION_STARTED]: false,
      [this.STATUS_NOT_REALIZED]: true,
    },
    [this.STATUS_CONSTRUCTION_STARTED]: {
      [this.STATUS_COMPLETED]: false,
      [this.STATUS_UNUSABLE]: true,
    },
    [this.STATUS_COMPLETED]: {
      [this.STATUS_DEMOLISHED]: true,
    },
    [this.STATUS_UNUSABLE]: {
      [this.STATUS_COMPLETED]: false,
      [this.STATUS_DEMOLISHED]: true,
    },
    [this.STATUS_DEMOLISHED]: {},
    [this.STATUS_NOT_REALIZED]: {},
  };

  static FORBIDDEN_BUILDING_CLASS_ERROR =
    "This building class is not allowed for a building newly being added into the FRBD. Please chose among building classes 1276, 1277, 1278 instead.";
}

export class Volume extends XMLModel {
  @tracked volume;
  @tracked informationSource;
  @tracked norm;

  constructor(xmlOrObject, root = "volume") {
    super(xmlOrObject);
    this.setFieldsFromXML({
      root,
      fields: {
        volume: Number,
        informationSource: Number,
        norm: Number,
      },
    });
  }

  static template = `
  <ns2:volume>
    <volume>{{model.volume}}</volume>
    {{#if model.informationSource}}
      <informationSource>{{model.informationSource}}</informationSource>
    {{/if}}
    <norm>{{model.norm}}</norm>
  </ns2:volume>
  `;

  static informationSourceOptions = [
    869, // Gemäss Baubewilligung
    858, // Gemäss Gebäudeenergieausweis der Kantone (GEAK)
    853, // Gemäss Gebäudeversicherung
    852, // Gemäss amtlicher Schätzung
    857, // Gemäss Eigentümer / Immobilienverwaltung
    851, // Gemäss amtlicher Vermessung
    870, // Gemäss topografisches Landschaft Modell (TLM)
    878, // Nicht bestimmbares Volumen (Gebäude nicht geschlossen)
    859, // Andere
  ];

  static normOptions = [
    961, // Gemäss SIA-Norm 116
    962, // Gemäss SIA-Norm 416
    969, // unbekannt
  ];
}

class ThermotechnicalDeviceForHeating1 extends ThermotechnicalDeviceForHeating {
  constructor(xmlOrObject, root = "thermotechnicalDeviceForHeating1") {
    super(xmlOrObject, root);
  }
}
class ThermotechnicalDeviceForHeating2 extends ThermotechnicalDeviceForHeating {
  constructor(xmlOrObject, root = "thermotechnicalDeviceForHeating2") {
    super(xmlOrObject, root);
  }
}
class ThermotechnicalDeviceForWarmWater1 extends ThermotechnicalDeviceForWarmWater {
  constructor(xmlOrObject, root = "thermotechnicalDeviceForWarmWater1") {
    super(xmlOrObject, root);
  }
}
class ThermotechnicalDeviceForWarmWater2 extends ThermotechnicalDeviceForWarmWater {
  constructor(xmlOrObject, root = "thermotechnicalDeviceForWarmWater2") {
    super(xmlOrObject, root);
  }
}
