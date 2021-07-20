import { tracked } from "@glimmer/tracking";

import DatePartiallyKnown from "./date-partially-known";

export default class DateOfConstruction extends DatePartiallyKnown {
  @tracked periodOfConstruction;

  constructor(xmlOrObject, root = "dateOfConstruction") {
    super(xmlOrObject, root);
    this.setFieldsFromXML({
      root,
      fields: {
        periodOfConstruction: Number,
      },
    });
  }

  static template = `
    {{#if model.yearMonthDay}}
      <ns2:dateOfConstruction>
        {{{modelField model "yearMonthDay" value=(echDate model.yearMonthDay) namespace=""}}}
      </ns2:dateOfConstruction>
    {{/if}}
  `;

  static periodOfConstructionOptions = [
    8011, // Periode vor 1919
    8012, // Periode von 1919 bis 1945
    8013, // Periode von 1946 bis 1960
    8014, // Periode von 1961 bis 1970
    8015, // Periode von 1971 bis 1980
    8016, // Periode von 1981 bis 1985
    8017, // Periode von 1986 bis 1990
    8018, // Periode von 1991 bis 1995
    8019, // Periode von 1996 bis 2000
    8020, // Periode von 2001 bis 2005
    8021, // Periode von 2006 bis 2010
    8022, // Periode von 2011 bis 2015
    8023, // Periode ab 2016
  ];
}
