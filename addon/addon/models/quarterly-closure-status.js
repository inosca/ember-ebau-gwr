import { tracked } from "@glimmer/tracking";

import XMLModel from "./xml-model";

export default class QuarterlyClosureStatus extends XMLModel {
  @tracked constructionSurveyDeptNumber;
  @tracked surveyStatus;

  constructor(xmlOrObject, root = "quarterlySurveyResponse") {
    super(xmlOrObject);
    this.setFieldsFromXML({
      root,
      fields: {
        constructionSurveyDeptNumber: Number,
        surveyStatus: Number,
      },
    });

    this.setFieldsFromXML({
      root: "errors",
      fields: {
        error: [String],
      },
    });
  }
}
export const [REQUEST_PENDING, WAITING, PROCESSING, ERROR, CLOSED] = [
  "requestPending",
  "waiting",
  "processing",
  "error",
  "closed",
];

export const STATUS_TYPES = {
  610: PROCESSING, // Datenerhebung initialisiert
  620: WAITING, // Erhebungsstelle wird aufgefordert Abschluss zu machen
  630: ERROR, // Abschluss durch die Erhebungsstelle mit Fehler
  640: ERROR, // Abschluss durch die Erhebungsstelle mit Fehler
  650: ERROR, // Kontrolle durch Kanton mit Fehler
  651: ERROR, // Abschluss durch die Erhebungsstelle mit Fehler
  660: PROCESSING, // Abschluss der EHS bereit zur Kontrolle für den Kanton
  661: PROCESSING, // Erneuter Abschluss EHS bereit zur Kontrolle für den Kanton
  662: PROCESSING, // Abschluss der EHS bereit zur Kontrolle für das BFS
  663: ERROR, // Kontrolle durch BFS mit Fehler
  665: ERROR, // Abschluss durch die Erhebungsstelle mit Fehler
  667: PROCESSING, // Erneuter Abschluss EHS bereit zur Kontrolle für das BFS
  670: PROCESSING, // Kontrollliste erstellt
  680: PROCESSING, // Abschluss durch das BFS
  690: CLOSED, // Daten der Erhebung kopiert für Snapshots BAU und CASA
  691: CLOSED, // Erzwungener Abschl. BFS
};
