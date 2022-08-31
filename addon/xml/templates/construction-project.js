// prettier-ignore
export const modifyConstructionProject =
`{{#>base}}
  <ns2:modifyConstructionProject>
    {{> ConstructionProject}}
    <ns2:reason>
      {{reason}}
    </ns2:reason>
  </ns2:modifyConstructionProject>
{{/base}}`;

// prettier-ignore
export const addConstructionProject =
`{{#>base}}
  <ns2:addConstructionProject>
    {{> ConstructionProject}}
  </ns2:addConstructionProject>
{{/base}}`;

// prettier-ignore
export const setToApprovedConstructionProject =
`{{#>base}}
  <ns2:setToApprovedConstructionProject>
    <ns2:buildingPermitIssueDate>{{echDate model.buildingPermitIssueDate}}</ns2:buildingPermitIssueDate>
  </ns2:setToApprovedConstructionProject>

  {{! TODO: send list of linked buildings and dwellings to be approved}}
{{/base}}`;

// prettier-ignore
export const setToRefusedConstructionProject =
`{{#>base}}
  <ns2:setToRefusedConstruction>
    <ns2:authorisationDeniedDate>{{echDate model.constructionAuthorisationDeniedDate}}</ns2:authorisationDeniedDate>
  </ns2:setToRefusedConstruction>
{{/base}}`;

// prettier-ignore
export const setToWithdrawnConstructionProject =
`{{#>base}}
  <ns2:setToWithdrawnConstruction>
    {{! TODO check if should be withdrawal date}}
    <ns2:withdrawalDate>{{echDate model.withdrawalDate}}</ns2:withdrawalDate>
  </ns2:setToWithdrawnConstruction>
{{/base}}`;

// prettier-ignore
export const setToCancelledConstructionProject =
`{{#>base}}
  <ns2:setToCancelledConstruction>
    <ns2:cancellationDate>{{echDate model.cancellationDate}}</ns2:cancellationDate>
  </ns2:setToCancelledConstruction>
{{/base}}`;

// prettier-ignore
export const setToSuspendedConstructionProject =
`{{#>base}}
  <ns2:setToSuspendedConstruction>
    <ns2:projectSuspensionDate>{{echDate model.projectSuspensionDate}}</ns2:projectSuspensionDate>
  </ns2:setToSuspendedConstruction>
{{/base}}`;

// prettier-ignore
export const setToStartConstructionProject =
`{{#>base}}
  <ns2:setToConstructionStarted>
    <ns2:projectStartDate>{{echDate model.projectStartDate}}</ns2:projectStartDate>
    <ns2:durationOfConstructionPhase>{{model.durationOfConstructionPhase}}</ns2:durationOfConstructionPhase>
  </ns2:setToConstructionStarted>
{{/base}}`;

// prettier-ignore
export const setToCompletedConstructionProject =
`{{#>base}}
  <ns2:setToCompletedConstructionProject>
    <ns2:constructionProject>
      <ns2:constructionSurveyDeptNumber>{{model.constructionSurveyDeptNumber}}</ns2:constructionSurveyDeptNumber>
      <ns2:constructionProjectDescription>{{model.constructionProjectDescription}}</ns2:constructionProjectDescription>
      {{> ConstructionLocalisation model=model.constructionLocalisation}}
      {{> RealestateIdentification model=model.realestateIdentification}}
      <ns2:typeOfPermit>{{model.typeOfPermit}}</ns2:typeOfPermit>
      <ns2:typeOfClient>{{model.typeOfClient}}</ns2:typeOfClient>
      {{! this is accepted by the api but in the response the field is missing. Is this intended?}}
      {{> Client model=model.client typeOfClient=model.typeOfClient}}
      <ns2:typeOfConstructionProject>{{model.typeOfConstructionProject}}</ns2:typeOfConstructionProject>
      <ns2:typeOfConstruction>{{model.typeOfConstruction}}</ns2:typeOfConstruction>
      <ns2:totalCostsOfProject>{{model.totalCostsOfProject}}</ns2:totalCostsOfProject>

      <ns2:projectCompletionDate>{{echDate model.projectCompletionDate}}</ns2:projectCompletionDate>
    </ns2:constructionProject>
  </ns2:setToCompletedConstructionProject>
{{/base}}`;

// prettier-ignore
export const setToCancelledSuspensionConstructionProject =
`{{#>base}}
  <ns2:setToCancelledSuspensionConstructionProject>
  </ns2:setToCancelledSuspensionConstructionProject>
{{/base}}`;

// prettier-ignore
export const getConstructionProject =
`{{#>base}}
  <ns2:getConstructionProject>
    <ns2:constructionSurveyDeptNumber>{{model.constructionSurveyDeptNumber}}</ns2:constructionSurveyDeptNumber>
    {{#if model.realestateIdentification.number}}
      <ns2:realestateIdentification>
        {{#if model.realestateIdentification.EGRID}}
          <EGRID>{{model.realestateIdentification.EGRID}}</EGRID>
        {{/if}}
        <number>{{model.realestateIdentification.number}}</number>
        {{#if model.realestateIdentification.subDistrict}}
          <subDistrict>{{model.realestateIdentification.subDistrict}}</subDistrict>
        {{/if}}
      </ns2:realestateIdentification>
    {{/if}}
    {{#if model.projectStatus}}
      <ns2:projectStatus>{{model.projectStatus}}</ns2:projectStatus>
    {{/if}}
    {{#if (isSet model.hasError)}}
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
