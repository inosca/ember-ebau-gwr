//prettier-ignore
export const modifyBuildingEntrance =
`{{#>base}}
  <ns2:modifyBuildingEntrance>
    {{> BuildingEntrance}}
    <ns2:reason>
      {{reason}}
    </ns2:reason>
  </ns2:modifyConstructionProject>
{{/base}}`;
