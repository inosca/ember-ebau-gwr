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
    <ns2:constructionSurveyDept>{{model.constructionSurveyDept}}</ns2:constructionSurveyDept>
    {{#if model.realestateIdentification.number}}
      <ns2:realestateIdentification>
        <number>{{model.realestateIdentification.number}}</number>
        {{#if model.realestateIdentification.EGRID}}
          <EGRID>{{model.realestateIdentification.EGRID}}</EGRID>
        {{/if}}
        {{#if model.realestateIdentification.numberSuffix}}
          <numberSuffix>{{model.realestateIdentification.numberSuffix}}</numberSuffix>
        {{/if}}
        {{#if model.realestateIdentification.subDistrict}}
          <subDistrict>{{model.realestateIdentification.subDistrict}}</subDistrict>
        {{/if}}
        {{#if model.realestateIdentification.lot}}
          <lot>{{model.realestateIdentification.lot}}</lot>
        {{/if}}
      </ns2:realestateIdentification>
    {{/if}}
    {{#if model.projectStatus}}
      <ns2:projectStatus>{{model.projectStatus}}</ns2:projectStatus>
    {{/if}}
    {{#if model.hasError}}
      <ns2:hasError>{{model.hasError}}</ns2:hasError>
    {{/if}}
    {{#if (or model.createDate.dateFrom model.createDate.dateTo)}}
      <ns2:createDate>
        {{#if model.createDate.dateFrom}}
          <ns2:dateFrom>{{echDate model.createDate.dateFrom}}</ns2:dateFrom>
        {{/if}}
        {{#if model.createDate.dateTo}}
          <ns2:dateTo>{{echDate model.createDate.dateTo}}</ns2:dateTo>
        {{/if}}
      </ns2:createDate>
    {{/if}}
    {{#if (or model.modifyDate.dateFrom model.modifyDate.dateTo)}}
      <ns2:modifyDate>
        {{#if model.modifyDate.dateFrom}}
          <ns2:dateFrom>{{echDate model.modifyDate.dateFrom}}</ns2:dateFrom>
        {{/if}}
        {{#if model.modifyDate.dateTo}}
          <ns2:dateTo>{{echDate model.modifyDate.dateTo}}</ns2:dateTo>
        {{/if}}
      </ns2:modifyDate>
    {{/if}}
  </ns2:getConstructionProject>
{{/base}}`;

// prettier-ignore
const getBuilding =
`{{#>base}}
  <ns2:getBuilding>
    <ns2:searchAddressType>
      <ns2:municipality>{{model.municipality}}</ns2:municipality>
      {{#if model.descriptionLong}}
        <ns2:street>
          <ns2:description>
            <ns2:language>{{model.streetLang}}</ns2:language>
            <ns2:descriptionLong>{{model.descriptionLong}}</ns2:descriptionLong>
          </ns2:description>
        </ns2:street>
      {{/if}}
      {{#if model.buildingEntranceNo}}
        <ns2:buildingEntranceNo>{{model.buildingEntranceNo}}</ns2:buildingEntranceNo>
      {{/if}}
      {{#if model.nameLong}}
        <ns2:locality>
          <ns2:name>
            <ns2:nameLong>{{model.nameLong}}</ns2:nameLong>
          </ns2:name>
        </ns2:locality>
      {{/if}}
    </ns2:searchAddressType>
    {{#if model.periodOfConstruction}}
      <ns2:dateOfConstruction>
        <periodOfConstruction>{{model.periodOfConstruction}}</periodOfConstruction>
      </ns2:dateOfConstruction>
    {{/if}}
    {{#if model.officialBuildingNo}}
      <ns2:officialBuildingNo>{{model.officialBuildingNo}}</ns2:officialBuildingNo>
    {{/if}}
    {{#if model.realestateIdentification.number}}
      <ns2:realestateIdentification>
        <number>{{model.realestateIdentification.number}}</number>
        {{#if model.realestateIdentification.EGRID}}
          <EGRID>{{model.realestateIdentification.EGRID}}</EGRID>
        {{/if}}
        {{#if model.realestateIdentification.numberSuffix}}
          <numberSuffix>{{model.realestateIdentification.numberSuffix}}</numberSuffix>
        {{/if}}
        {{#if model.realestateIdentification.subDistrict}}
          <subDistrict>{{model.realestateIdentification.subDistrict}}</subDistrict>
        {{/if}}
        {{#if model.realestateIdentification.lot}}
          <lot>{{model.realestateIdentification.lot}}</lot>
        {{/if}}
      </ns2:realestateIdentification>
    {{/if}}
    {{#if model.hasError}}
      <ns2:hasError>{{model.hasError}}</ns2:hasError>
    {{/if}}
    {{#if (or model.createDate.dateFrom model.createDate.dateTo)}}
      <ns2:createDate>
        {{#if model.createDate.dateFrom}}
          <ns2:dateFrom>{{echDate model.createDate.dateFrom}}</ns2:dateFrom>
        {{/if}}
        {{#if model.createDate.dateTo}}
          <ns2:dateTo>{{echDate model.createDate.dateTo}}</ns2:dateTo>
        {{/if}}
      </ns2:createDate>
    {{/if}}
    {{#if (or model.modifyDate.dateFrom model.modifyDate.dateTo)}}
      <ns2:modifyDate>
        {{#if model.modifyDate.dateFrom}}
          <ns2:dateFrom>{{echDate model.modifyDate.dateFrom}}</ns2:dateFrom>
        {{/if}}
        {{#if model.modifyDate.dateTo}}
          <ns2:dateTo>{{echDate model.modifyDate.dateTo}}</ns2:dateTo>
        {{/if}}
      </ns2:modifyDate>
    {{/if}}
  </ns2:getBuilding>
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
  getBuilding,
};
export const Partials = { header, delivery, base };
