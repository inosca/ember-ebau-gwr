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
    {{#if model.locality.name.nameLong}}
      <ns2:locality>
        <ns2:name>
         <ns2:nameLong>{{model.locality.name.nameLong}}</ns2:nameLong>
        </ns2:name>
      </ns2:locality>
    {{/if}}
  </ns2:getStreet>
{{/base}}`;
