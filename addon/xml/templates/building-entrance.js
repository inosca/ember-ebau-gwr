//prettier-ignore
export const addBuildingEntrance =
`{{#>base}}
  <ns2:addBuildingEntrance>
    {{> BuildingEntrance}}
    <ns2:reason>
      {{reason}}
    </ns2:reason>
  </ns2:addBuildingEntrance>
{{/base}}`;

//prettier-ignore
export const modifyBuildingEntrance =
`{{#>base}}
  <ns2:modifyBuildingEntrance>
    {{> BuildingEntrance}}
    <ns2:reason>
      {{reason}}
    </ns2:reason>
  </ns2:modifyBuildingEntrance>
{{/base}}`;

//prettier-ignore
export const deactivateBuildingEntrance =
`{{#>base}}
  <ns2:deactivateBuildingEntrance>
    <ns2:reason>
      {{reason}}
    </ns2:reason>
  </ns2:deactivateBuildingEntrance>
{{/base}}`;

//prettier-ignore
export const setStreet =
`{{#>base}}
  <ns2:modifyBuildingEntrance>
    <ns2:buildingEntrance>
      <ns2:EGAID>{{model.EGAID}}</ns2:EGAID>
      {{> Street model=model.street}}
    </ns2:buildingEntrance>
    <ns2:reason>
      {{reason}}
    </ns2:reason>
  </ns2:modifyBuildingEntrance>
{{/base}}`;
