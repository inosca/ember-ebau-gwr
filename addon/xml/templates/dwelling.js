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
