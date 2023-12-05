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

  // Frontend only tracking to display floor in form
  @tracked floorType;
  @tracked floorNumber;

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

    const floor = Number(this.floor);
    if (floor === 3100) {
      this.floorType = 3100;
    } else if (floor > 3100 && floor < 3200) {
      this.floorType = 3101;
      this.floorNumber = floor - 3100;
    } else if (floor > 3400 && floor < 3420) {
      this.floorType = 3401;
      this.floorNumber = floor - 3400;
    }
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

  static floorTypeOptions = [
    3100, // Parterre
    3101, // Stock
    3401, // Untergeschoss
  ];

  get floorComplete() {
    return this.floorType === 3100
      ? this.floorType
      : Number(this.floorType) + Number(this.floorNumber) - 1;
  }

  get floorLabel() {
    const floor = Number(this.floor);
    return floor === 3100
      ? { label: "ember-gwr.building.dwellings.groundFloor" }
      : floor > 3100 && floor < 3200
        ? { label: "ember-gwr.building.dwellings.floor", number: floor - 3100 }
        : floor > 3400 && floor < 3420
          ? {
              label: "ember-gwr.building.dwellings.cellar",
              number: floor - 3400,
            }
          : "";
  }

  static STATUS_PROJECTED = 3001;
  static STATUS_APPROVED = 3002;
  static STATUS_CONSTRUCTION_STARTED = 3003;
  static STATUS_COMPLETED = 3004;
  static STATUS_UNUSABLE = 3005;
  static STATUS_DEMOLISHED = 3007;
  static STATUS_NOT_REALIZED = 3008;

  // valid state transitions
  static dwellingStatesMapping = {
    [this.STATUS_PROJECTED]: [this.STATUS_APPROVED, this.STATUS_NOT_REALIZED], // Projektiert
    [this.STATUS_APPROVED]: [
      this.STATUS_CONSTRUCTION_STARTED,
      this.STATUS_NOT_REALIZED,
    ], // Bewilligt
    [this.STATUS_CONSTRUCTION_STARTED]: [
      this.STATUS_NOT_REALIZED,
      this.STATUS_COMPLETED,
      this.STATUS_UNUSABLE,
    ], // Im Bau
    [this.STATUS_COMPLETED]: [this.STATUS_DEMOLISHED], // Bestehend
    [this.STATUS_UNUSABLE]: [this.STATUS_COMPLETED, this.STATUS_DEMOLISHED], // Nicht nutzbar
    [this.STATUS_DEMOLISHED]: [], // Aufgehoben
    [this.STATUS_NOT_REALIZED]: [], // Nicht realiziert
  };

  // api requests for state transitions
  static dwellingTransitionMapping = {
    [this.STATUS_PROJECTED]: {
      [this.STATUS_APPROVED]: "setToApprovedDwelling",
      [this.STATUS_NOT_REALIZED]: "setToNotRealizedDwelling",
    },
    [this.STATUS_APPROVED]: {
      [this.STATUS_CONSTRUCTION_STARTED]: "setToDwellingConstructionStarted",
      [this.STATUS_NOT_REALIZED]: "setToNotRealizedDwelling",
    },
    [this.STATUS_CONSTRUCTION_STARTED]: {
      [this.STATUS_NOT_REALIZED]: "setToNotRealizedDwelling",
      [this.STATUS_COMPLETED]: "setToCompletedDwelling",
      [this.STATUS_UNUSABLE]: "setToUnusableDwelling",
    },
    [this.STATUS_COMPLETED]: {
      [this.STATUS_DEMOLISHED]: "setToDemolishedDwelling",
    },
    [this.STATUS_UNUSABLE]: {
      [this.STATUS_COMPLETED]: "setToCompletedDwelling",
      [this.STATUS_DEMOLISHED]: "setToDemolishedDwelling",
    },
    [this.STATUS_DEMOLISHED]: {},
    [this.STATUS_NOT_REALIZED]: {},
  };

  // possible status parameters
  static statusParameters = ["yearOfConstruction", "yearOfDemolition"];

  // necessary parameters for status transitions in status changes
  static dwellingTransitionParameters = {
    setToApprovedDwelling: [],
    setToCompletedDwelling: [
      {
        field: "yearOfConstruction",
        type: "number",
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
    [this.STATUS_PROJECTED]: [],
    [this.STATUS_APPROVED]: [],
    [this.STATUS_CONSTRUCTION_STARTED]: [],
    [this.STATUS_COMPLETED]: [
      {
        field: "yearOfConstruction",
        type: "number",
        required: true,
      },
    ],
    [this.STATUS_UNUSABLE]: [],
    [this.STATUS_DEMOLISHED]: [
      {
        field: "yearOfConstruction",
        type: "number",
        required: false,
      },
      { field: "yearOfDemolition", type: "number", required: true },
    ],
    [this.STATUS_NOT_REALIZED]: [],
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
        revisionDate: Date,
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
        "dwellingCompleteResponse",
      ) ?? [];
    this.dwelling.errorList = errorList;
  }
}
