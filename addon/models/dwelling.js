import XMLModel from "./xml-model";
import { tracked } from "@glimmer/tracking";
import DateOfConstruction from "./date-of-construction";
import DatePartiallyKnown from "./date-partially-known";
import RealestateIdentification from "./realestate-identification";
import { setRoot } from "./helpers";

const DateOfDemolition = new setRoot(DatePartiallyKnown, "dateOfDemolition");

export default class Dwelling extends XMLModel {
  @tracked EWID;
  @tracked administrativeDwellingNo;
  @tracked physicalDwellingNo;
  @tracked dateOfConstruction = new DateOfConstruction();
  @tracked dateOfDemolition = new DateOfDemolition();
  @tracked noOfHabitableRooms;
  @tracked floor;
  @tracked multipleFloor;
  @tracked locationOfDwellingOnFloor;
  @tracked usageLimitation;
  @tracked kitchen;
  @tracked surfaceAreaOfDwelling;
  @tracked status;
  @tracked dwellingUsage = new DwellingUsage();
  @tracked realestateIdentification = new RealestateIdentification();
  @tracked dwellingFreeText1;
  @tracked dwellingFreeText2;

  constructor(xmlOrObject, root = "dwelling") {
    super(xmlOrObject);
    this.setFieldsFromXML({
      root,
      fields: {
        EWID: Number,
        administrativeDwellingNo: String,
        physicalDwellingNo: String,
        dateOfConstruction: DateOfConstruction,
        dateOfDemolition: DateOfDemolition,
        noOfHabitableRooms: Number,
        floor: Number,
        multipleFloor: Boolean,
        locationOfDwellingOnFloor: String,
        usageLimitation: Number,
        kitchen: Boolean,
        surfaceAreaOfDwelling: Number,
        status: Number,
        dwellingUsage: DwellingUsage,
        realestateIdentification: RealestateIdentification,
        dwellingFreeText1: String,
        dwellingFreeText2: String,
      },
    });
  }

  static usageLimitationOptions = [
    3401, // Keine Beschränkung (Art. 8, 9 und 10 ZWG)
    3402, // Erstwohnung (Art. 7 Abs.1 Bst. a ZWG)
    3403, // Tour. bewirtschaftete Wohnung (Art. 7 Abs. 2 Bst. a ZWG)
    3404, // Tour. bewirtschaftete Wohnung (Art. 7 Abs. 2 Bst. b ZWG)
  ];
  static statusOptions = [
    3001, // Projektiert
    3002, // Bewilligt
    3003, // Im Bau
    3004, // Bestehend
    3005, // Nicht nutzbar
    3007, // Aufgehoben
  ];
}

export class DwellingUsage extends XMLModel {
  @tracked usageCode;
  @tracked informationSource;
  @tracked revisionDate;
  @tracked remark;
  @tracked personWithMainResidence;
  @tracked personWithSecondaryResidence;
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
