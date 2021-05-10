import { tracked } from "@glimmer/tracking";

import BuildingEntrance from "./building-entrance";
import Coordinates from "./coordinates";
import DateOfConstruction from "./date-of-construction";
import DateOfDemolition from "./date-of-demolition";
import LocalId from "./local-id";
import RealestateIdentification from "./realestate-identification";
import ThermotechnicalDeviceForHeating from "./thermotechnical-device-for-heating";
import ThermotechnicalDeviceForWarmWater from "./thermotechnical-device-for-warm-water";
import XMLModel from "./xml-model";

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
  static informationSource = [
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

  static norm = [
    961, // Gemäss SIA-Norm 116
    962, // Gemäss SIA-Norm 416
    969, // unbekannt
  ];
}

export default class Building extends XMLModel {
  @tracked EGID;
  @tracked municipality;
  @tracked officialBuildingNo;
  @tracked nameOfBuilding;
  @tracked coordinates = new Coordinates();
  @tracked realestateIdentification = [];
  @tracked localCode1;
  @tracked localCode2;
  @tracked localCode3;
  @tracked localCode4;
  @tracked neighbourhood;
  @tracked buildingStatus;
  @tracked buildingCategory;
  @tracked buildingClass;
  @tracked dateOfConstruction = new DateOfConstruction();
  @tracked dateOfDemolition = new DateOfDemolition();
  @tracked surfaceAreaOfBuilding;
  @tracked volume = new Volume();
  @tracked numberOfFloors;
  @tracked numberOfSeparateHabitableRooms;
  @tracked civilDefenseShelter;
  @tracked energyRelevantSurface;
  @tracked thermotechnicalDeviceForHeating = [];
  @tracked thermotechnicalDeviceForWarmWater = [];
  @tracked buildingFreeText1;
  @tracked buildingFreeText2;
  @tracked localId = [];
  @tracked buildingEntrance = [];

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
        realestateIdentification: [RealestateIdentification],
        localCode1: String,
        localCode2: String,
        localCode3: String,
        localCode4: String,
        neighbourhood: Number,
        buildingStatus: Number,
        buildingCategory: Number,
        buildingClass: Number,
        dateOfConstruction: DateOfConstruction,
        dateOfDemolition: DateOfDemolition,
        surfaceAreaOfBuilding: Number,
        volume: Volume,
        numberOfFloors: Number,
        numberOfSeparateHabitableRooms: Number,
        civilDefenseShelter: Boolean,
        energyRelevantSurface: Number,
        thermotechnicalDeviceForHeating: [ThermotechnicalDeviceForHeating],
        thermotechnicalDeviceForWarmWater: [ThermotechnicalDeviceForWarmWater],
        buildingFreeText1: String,
        buildingFreeText2: String,
        localId: [LocalId],
        buildingEntrance: [BuildingEntrance],
      },
    });
  }

  get fullAddressTexts() {
    return (
      this.buildingEntrance?.map(
        (buildingEntrance) =>
          `${buildingEntrance.street.description.descriptionLong ?? ""} ${
            buildingEntrance.buildingEntranceNo ?? ""
          }, ${buildingEntrance.locality.swissZipCode ?? ""} ${
            buildingEntrance.locality.name.nameLong ?? ""
          }`
      ) ?? ""
    );
  }

  static buildingStatus = [
    1001, // Projektiert
    1002, // Bewilligt
    1003, // Im Bau
    1004, // Bestehend
    1005, // Nicht nutzbar
    1007, // Abgebrochen
    1008, // Nicht realisiert
  ];

  static buildingCategory = [
    1010, // Provisorische Unterkunft
    1020, // Reine Wohngebäude (Wohnnutzung ausschliesslich)
    1030, // Wohngebäude mit Nebennutzung
    1040, // Gebäude mit teilweiser Wohnnutzung
    1060, // Gebäude ohne Wohnnutzung
    1080, // Sonderbau
  ];

  static buildingClass = [
    1231, //  Restaurants und Bars in Gebäude ohne Wohnnutzung
    1275, //  Andere Gebäude für kollektive Beherbergung
    1276, // Gebäude für Tierhaltung;
    1277, // Gebäude für den Pflanzenbau;
    1278, // Andere landwirtschaftliche Gebäude.
  ];
}
