// prettier-ignore
const modifyConstructionProject =
`{{#>base}}
  <ns2:modifyConstructionProject>
    {{> ConstructionProject}}
    <ns2:reason>
      {{reason}}
    </ns2:reason>
  </ns2:modifyConstructionProject>
{{/base}}`;

// prettier-ignore
const addConstructionProject =
`{{#>base}}
  <ns2:addConstructionProject>
    {{> ConstructionProject}}
  </ns2:addConstructionProject>
{{/base}}`;

// prettier-ignore
const getConstructionProject =
`{{#>base}}
  <ns2:getConstructionProject>
  </ns2:getConstructionProject>
{{/base}}`;

const header = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`;

// prettier-ignore
const delivery =
`<ns2:delivery
  xmlns="http://www.ech.ch/xmlns/eCH-0129/5"
  xmlns:ns2="http://www.ech.ch/xmlns/eCH-0216/1"
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
  modifyConstructionProject,
  addConstructionProject,
  getConstructionProject,
};
export const Partials = { header, delivery, base };
