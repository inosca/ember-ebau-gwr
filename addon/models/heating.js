import { tracked } from "@glimmer/tracking";

import XMLModel from "./xml-model";

export default class Heating extends XMLModel {
  @tracked energySourceHeating;
  @tracked informationSourceHeating;
  @tracked revisionDate;

  constructor(xmlOrObject, root = "heating") {
    super(xmlOrObject);
    this.setFieldsFromXML({
      root,
      fields: {
        energySourceHeating: Number,
        informationSourceHeating: Number,
        revisionDate: Date,
      },
    });
  }

  static energySourceHeatingOptions = [
    7500, // Keine
    7501, // Luft
    7510, // Erdwärme (generisch)
    7511, // Erdwärmesonde
    7512, // Erdregister
    7513, // Wasser (Grundwasser, Oberflächenwasser, Abwasser)
    7520, // Gas
    7530, // Heizöl
    7540, // Holz (generisch)
    7541, // Holz (Stückholz)
    7542, // Holz (Pellets)
    7543, // Holz (Schnitzel)
    7550, // Abwärme (innerhalb des Gebäudes)
    7560, // Elektrizität
    7570, // Sonne (thermisch)
    7580, // Fernwärme (generisch)
    7581, // Fernwärme (Hochtemperatur)
    7582, // Fernwärme (Niedertemperatur)
    7598, // Unbestimmt
    7599, // Andere
  ];

  static informationSourceHeatingOptions = [
    852, // Gemäss amtlicher Schätzung
    853, // Gemäss Gebäudeversicherung
    855, // Gemäss Feuerungskontrolle
    857, // Gemäss Eigentümer/in oder Verwaltung
    858, // Gemäss Gebäudeenergieausweis der Kantone (GEAK)
    859, // Andere Datenquelle
    860, // Gemäss Volkszählung 2000
    864, // Gemäss Daten des Kantons
    865, // Gemäss Daten der Gemeinde
    869, // Gemäss Baubewilligung
    870, // Gemäss Versorgungswerk (Gas, Fernwärme)
    871, // Gemäss Minergie
  ];
}
