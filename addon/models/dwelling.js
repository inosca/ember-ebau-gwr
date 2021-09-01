import { tracked } from "@glimmer/tracking";

import ErrorList from "./error-list";
import RealestateIdentification from "./realestate-identification";
import XMLModel from "./xml-model";

export default class Dwelling extends XMLModel {
  @tracked EWID;
  @tracked administrativeDwellingNo;
  @tracked physicalDwellingNo;
  @tracked yearOfConstruction;
  @tracked yearOfDemolition;
  @tracked noOfHabitableRooms;
  @tracked floor;
  @tracked multipleFloor = false;
  @tracked locationOfDwellingOnFloor;
  @tracked usageLimitation;
  @tracked kitchen = false;
  @tracked surfaceAreaOfDwelling;
  @tracked dwellingStatus;
  @tracked dwellingUsage = new DwellingUsage();
  @tracked realestateIdentification = new RealestateIdentification();
  @tracked dwellingFreeText1;
  @tracked dwellingFreeText2;

  @tracked errorList = [];

  // This is a frontend only state tracking property while creating new records.
  @tracked EDID;

  constructor(xmlOrObject, root = "dwelling") {
    super(xmlOrObject);
    this.setFieldsFromXML({
      root,
      fields: {
        EWID: Number,
        administrativeDwellingNo: String,
        physicalDwellingNo: String,
        yearOfConstruction: Number,
        yearOfDemolition: Number,
        noOfHabitableRooms: Number,
        floor: Number,
        multipleFloor: Boolean,
        locationOfDwellingOnFloor: String,
        usageLimitation: Number,
        kitchen: Boolean,
        surfaceAreaOfDwelling: Number,
        dwellingStatus: Number,
        dwellingUsage: DwellingUsage,
        realestateIdentification: RealestateIdentification,
        dwellingFreeText1: String,
        dwellingFreeText2: String,
      },
    });
  }

  static template = `
    <ns2:dwelling>
      {{{modelField model "administrativeDwellingNo"}}}
      {{{modelField model "physicalDwellingNo"}}}
      {{{modelField model "yearOfConstruction"}}}
      {{{modelField model "yearOfDemolition"}}}
      {{! TODO Type of those two fields is completly different that what is documented. So a todo until doc is updated.}}
      {{{modelField model "noOfHabitableRooms"}}}
      {{{modelField model "floor"}}}
      {{{modelField model "multipleFloor"}}}
      {{{modelField model "locationOfDwellingOnFloor"}}}
      {{{modelField model "usageLimitation"}}}
      {{{modelField model "kitchen"}}}
      {{{modelField model "surfaceAreaOfDwelling"}}}
      {{#unless isComplete}}
        {{{modelField model "dwellingStatus"}}}
      {{/unless}}
      {{> DwellingUsage model=model.dwellingUsage}}
      {{> RealestateIdentification model=model.realestateIdentification}}
      {{{modelField model "dwellingFreeText1"}}}
      {{{modelField model "dwellingFreeText2"}}}
    </ns2:dwelling>
  `;

  static usageLimitationOptions = [
    3401, // Keine Beschränkung (Art. 8, 9 und 10 ZWG)
    3402, // Erstwohnung (Art. 7 Abs.1 Bst. a ZWG)
    3403, // Tour. bewirtschaftete Wohnung (Art. 7 Abs. 2 Bst. a ZWG)
    3404, // Tour. bewirtschaftete Wohnung (Art. 7 Abs. 2 Bst. b ZWG)
  ];
  static dwellingStatusOptions = [
    3001, // Projektiert
    3002, // Bewilligt
    3003, // Im Bau
    3004, // Bestehend
    3005, // Nicht nutzbar
    3007, // Aufgehoben
    3008, // Nicht realisiert
  ];

  get floorLabel() {
    const floor = Number(this.floor);
    return floor === 3100
      ? { label: "ember-gwr.building.dwellings.groundFloor" }
      : floor > 3100 && floor < 3200
      ? { label: "ember-gwr.building.dwellings.floor", number: floor - 3100 }
      : floor > 3400 && floor < 3420
      ? { label: "ember-gwr.building.dwellings.cellar", number: floor - 3400 }
      : "";
  }

  // valid state transitions
  static dwellingStatesMapping = {
    3001: [3002, 3008], // Projektiert
    3002: [3003, 3008], // Bewilligt
    3003: [3008, 3004, 3005], // Im Bau
    3004: [3007], // Bestehend
    3005: [3004, 3007], // Nicht nutzbar
    3007: [], // Aufgehoben
    3008: [], // Nicht realiziert
  };

  // api requests for state transitions
  static dwellingTransitionMapping = {
    3001: {
      // TODO: dwellings are approved through construction project approval
      //3002: "setToApprovedConstructionProject", // set dwellings to approve on construction project?
      3002: "setToApprovedDwelling",
      3008: "setToNotRealizedDwelling",
    },
    3002: {
      3003: "setToDwellingConstructionStarted",
      3008: "setToNotRealizedDwelling",
    },
    3003: {
      3008: "setToNotRealizedDwelling",
      3004: "setToCompletedDwelling",
      3005: "setToUnusableDwelling",
    },
    3004: {
      3007: "setToDemolishedDwelling",
    },
    3005: {
      3004: "setToCompletedDwelling",
      3007: "setToDemolishedDwelling",
    },
    3007: {},
    3008: {},
  };

  // possible status parameters
  static statusParameters = [
    "dateOfConstruction.yearMonthDay",
    "yearOfDemolition",
  ];

  // necessary parameters for status transitions in status changes
  static dwellingTransitionParameters = {
    // TODO: dwellings are approved through construction project approval
    //setToApprovedConstructionProject: [],
    setToApprovedDwelling: [],
    setToCompletedDwelling: [
      {
        field: "dateOfConstruction.yearMonthDay",
        type: "date",
        required: true,
      },
    ],
    setToDemolishedDwelling: [
      { field: "yearOfDemolition", type: "number", required: true },
    ],
    setToNotRealizedDwelling: [],
    setToDwellingConstructionStarted: [],
    setToUnusableDwelling: [],
  };

  // necessary fields for target state in status corrections
  static dwellingTransitionParametersMapping = {
    3001: [],
    3002: [],
    3003: [],
    3004: [
      {
        field: "dateOfConstruction.yearMonthDay",
        type: "date",
        required: true,
      },
    ],
    3005: [],
    3007: [
      {
        field: "dateOfConstruction.yearMonthDay",
        type: "date",
        required: false,
      },
      { field: "yearOfDemolition", type: "number", required: true },
    ],
    3008: [],
  };
}

export class DwellingUsage extends XMLModel {
  @tracked usageCode;
  @tracked informationSource;
  @tracked revisionDate;
  @tracked remark;
  @tracked personWithMainResidence = false;
  @tracked personWithSecondaryResidence = false;
  @tracked dateFirstOccupancy;
  @tracked dateLastOccupancy;

  constructor(xmlOrObject, root = "dwellingUsage") {
    super(xmlOrObject);
    this.setFieldsFromXML({
      root,
      fields: {
        usageCode: Number,
        informationSource: Number,
        revisionDate: String,
        remark: String,
        personWithMainResidence: Boolean,
        personWithSecondaryResidence: Boolean,
        dateFirstOccupancy: String,
        dateLastOccupancy: String,
      },
    });
  }

  static template = `
    <ns2:dwellingUsage>
      {{{modelField model "usageCode" namespace=""}}}
      {{{modelField model "informationSource" namespace=""}}}
      {{{modelField model "revisionDate" value=(echDate model.revisionDate) namespace=""}}}
      {{{modelField model "remark" namespace=""}}}
      {{{modelField model "dateFirstOccupancy" value=(echDate model.dateFirstOccupancy) namespace=""}}}
      {{{modelField model "dateLastOccupancy" value=(echDate model.dateLastOccupancy) namespace=""}}}
    </ns2:dwellingUsage>
  `;

  static usageCodeOptions = [
    3010, // Bewohnt gemäss RHG Art. 3 Bst. b (Erstwohnung, Art. 2 Abs. 2 ZWG)
    3020, // Zeitweise bewohnt (Zweitwohnung, Art. 2 Abs. 4 ZWG)
    3030, // Zweckentfremdet (anders als zum Wohnen genutzt gem. Art. 2 Abs. 3 Bst. h ZWG)
    3031, // Zu Erwerbs- oder Ausbildungszwecken bewohnt (Art. 2 Abs. 3 Bst. a ZWG)
    3032, // Von einem Privathaushalt mit Erstwohnung im gleichen Gebäude bewohnt (Art. 2 Abs. 3 Bst. b ZWG)
    3033, // Bewohnt von nicht meldepflichtigen Personen (Art. 2 Abs. 3 Bst. c ZWG)
    3034, // Leerstehend seit höchstens zwei Jahren (Art. 2 Abs. 3 Bst. d ZWG)
    3035, // Für alpwirtschaftliche Zwecke genutzt (Art. 2 Abs. 3 Bst. e ZWG)
    3036, // Zur Unterbringung von Personal genutzt (Art. 2 Abs. 3 Bst. f ZWG)
    3037, // Dienstwohnungen (Art. 2 Abs. 3 Bst. g ZWG)
    3038, // Von einem Kollektivhaushalt gemäss Art.2, Bst. abis der Registerharmonisierungsverordnung genutzt
    3070, // Wohnung unbewohnbar
  ];
  static informationSourceOptions = [
    3090, // Automatische Aktualisierung (Art. 2 Abs. 1 Zweitwohnungsverordnung ZWV)
    3091, // Einwohnerkontrolle
    3092, // Eigentümer/in oder Verwaltung
    3093, // Andere Datenquelle
  ];
}

export class DwellingComplete extends XMLModel {
  @tracked EGID;
  @tracked EDID;
  @tracked dwelling = new Dwelling();

  constructor(xmlOrObject, root = "dwellingCompleteResponse") {
    super(xmlOrObject);
    this.setFieldsFromXML({
      root,
      fields: {
        EGID: Number,
        EDID: Number,
        dwelling: Dwelling,
      },
    });

    const errorList =
      this.getFieldFromXML(
        "errorList",
        [ErrorList],
        "dwellingCompleteResponse"
      ) ?? [];
    this.dwelling.errorList = errorList;
  }
}
