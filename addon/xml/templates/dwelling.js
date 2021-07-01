//prettier-ignore
export const modifyDwelling =
`{{#>base}}
  <ns2:modifyDwelling>
    {{> Dwelling}}
    <ns2:reason>
      {{reason}}
    </ns2:reason>
  </ns2:modifyDwelling>
{{/base}}`;

//prettier-ignore
export const addDwelling =
`{{#>base}}
  <ns2:addDwellingToConstructionProject>
    {{> Dwelling}}
    <ns2:reason>
      {{reason}}
    </ns2:reason>
  </ns2:addDwellingToConstructionProject>
{{/base}}`;

//prettier-ignore
export const deactivateDwelling =
`{{#>base}}
  <ns2:deactivateDwelling>
    <ns2:reason>
      {{reason}}
    </ns2:reason>
  </ns2:deactivateDwelling>
{{/base}}`;

//prettier-ignore
export const reallocateDwelling =
`{{#>base}}
  <ns2:reallocateDwelling>
    <ns2:oldEDID>{{model.oldEDID}}</ns2:oldEDID>
    <ns2:newEDID>{{model.newEDID}}</ns2:newEDID>
    <ns2:reason>
      {{reason}}
    </ns2:reason>
  </ns2:reallocateDwelling>
{{/base}}`;
