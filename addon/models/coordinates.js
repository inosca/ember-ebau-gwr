import { tracked } from "@glimmer/tracking";

import XMLModel from "./xml-model";

export default class Coordinates extends XMLModel {
  @tracked east;
  @tracked north;
  @tracked originOfCoordinates;

  constructor(xmlOrObject, root = "coordinates") {
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

  static template = `
  {{#if model.east}}
    <ns2:coordinates>
      <ns2:east>{{model.east}}</ns2:east>
      <ns2:north>{{model.north}}</ns2:north>
      <ns2:originOfCoordinates>{{model.originOfCoordinates}}</ns2:originOfCoordinates>
    </ns2:coordinates>
  {{/if}}
  `;

  static originOfCoordinatesOptions = [
    901, //  Amtliche Vermessung, DM.01
    902, //  Aus amtlicher Vermessung hergeleitet
    903, //  Angabe Nachführungsgeometer
    904, //  Angabe Baugesuch
    905, //  Bundesamt für Statistik (BFS)
    906, //  Datensatz GeoPost
    909, //	 Andere Datenquelle
  ];
}
