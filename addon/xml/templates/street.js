// prettier-ignore
export const getStreet =
  `{{#>base}}
  <ns2:getStreet>
    {{#if model.description.descriptionLong}}
      <ns2:description>
        <ns2:language>{{model.language}}</ns2:language>
        <ns2:descriptionLong>{{model.description.descriptionLong}}</ns2:descriptionLong>
      </ns2:description>
    {{/if}}
    {{#if model.locality.nameLong}}
      {{> Locality model=model.locality}}
    {{/if}}
  </ns2:getStreet>
{{/base}}`;
