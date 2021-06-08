import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import BuildingWork from "ember-ebau-gwr/models/building-work";

export default class LinkBuildingModalComponent extends Component {
  @tracked buildingWork = new BuildingWork();
  kindOfWorkOptions = BuildingWork.kindOfWorkOptions;
}
