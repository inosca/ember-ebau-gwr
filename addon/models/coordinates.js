import { tracked } from "@glimmer/tracking";

import XMLModel from "./xml-model";

export class LV95 extends XMLModel {
  @tracked east;
  @tracked north;
  @tracked originOfCoordinates;

  constructor(xmlOrObject, root = "building") {
    super(xmlOrObject);
    this.setFieldsFromXML({
      root,
      fields: {
        east: Number,
        north: Number,
        originOfCoordinates: Number,
      },
    });
  }
}

export default class Coordinates extends XMLModel {
  LV95 = new LV95();

  constructor(xmlOrObject, root = "coordinates") {
    super(xmlOrObject);
    this.setFieldsFromXML({
      root,
      fields: {
        LV95,
      },
    });
  }

  static originOfCoordinates = [
    901, //  Amtliche Vermessung, DM.01
    902, //  Aus amtlicher Vermessung hergeleitet
    903, //  Angabe Nachführungsgeometer
    904, //  Angabe Baugesuch
    905, //  Bundesamt für Statistik (BFS)
    906, //  Datensatz GeoPost
    909, //	 Andere Datenquelle
  ];
}
