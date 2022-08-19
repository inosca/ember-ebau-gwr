import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import BuildingWork from "ember-ebau-gwr/models/building-work";

// Remove the state "Neubau" from the array since you cant link
// existing buildings as "Neubau".
const KIND_OF_WORK_OPTIONS = BuildingWork.kindOfWorkOptions.slice(1);

export default class LinkBuildingModalComponent extends Component {
  @service config;
  @service intl;
  @tracked buildingWork = new BuildingWork();

  constructor(...args) {
    super(...args);
    this.buildingWork.kindOfWork = this.kindOfWorkOptions[0].value;
  }

  get kindOfWorkOptions() {
    return KIND_OF_WORK_OPTIONS.map((option) => ({
      value: option,
      label: this.intl.t(`ember-gwr.buildingWork.kindOfWorkOptions.${option}`),
    }));
  }
}
