import * as BuildingTemplates from "./templates/building";
import * as BuildingEntranceTemplates from "./templates/building-entrance";
import * as ConstructionProjectTemplates from "./templates/construction-project";
import * as DwellingTemplates from "./templates/dwelling";
import * as StreetTemplates from "./templates/street";

const header = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`;

// prettier-ignore
const delivery =
`<ns2:delivery
  xmlns="http://www.ech.ch/xmlns/eCH-0129/5"
  xmlns:ns2="http://www.ech.ch/xmlns/eCH-0216/2"
  xmlns:ns3="http://www.ech.ch/xmlns/eCH-0097/2"
  xmlns:ns4="http://www.ech.ch/xmlns/eCH-0044/4"
  xmlns:ns5="http://www.ech.ch/xmlns/eCH-0010/6"
  xmlns:ns6="http://www.ech.ch/xmlns/eCH-0007/6"
  xmlns:ns7="http://www.ech.ch/xmlns/eCH-0008/3"
  xmlns:ns8="http://www.ech.ch/xmlns/eCH-0058/5"
>
  {{> @partial-block}}
</ns2:delivery>`;

// prettier-ignore
const base =
`{{> header}}
{{#>delivery}}
  {{> @partial-block}}
{{/delivery}}`;

export const Templates = {
  ...ConstructionProjectTemplates,
  ...BuildingTemplates,
  ...BuildingEntranceTemplates,
  ...StreetTemplates,
  ...DwellingTemplates,
};
export const Partials = { header, delivery, base };
