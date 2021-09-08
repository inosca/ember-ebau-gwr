import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import BuildingWork from "ember-ebau-gwr/models/building-work";

export default class LinkBuildingModalComponent extends Component {
  @tracked buildingWork = new BuildingWork();
  // Remove the state "Neubau" from the array since you cant link
  // existing buildings as "Neubau".
  kindOfWorkOptions = BuildingWork.kindOfWorkOptions.slice(1);

  constructor(...args) {
    super(...args);
    this.buildingWork = new BuildingWork();
    this.buildingWork.kindOfWork = this.kindOfWorkOptions[0];
  }
}
