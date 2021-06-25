import Component from "@glimmer/component";
import { dropTask } from "ember-concurrency-decorators";
import BuildingValidations from "ember-ebau-gwr/validations/building";
import ProjectValidations from "ember-ebau-gwr/validations/project";

export const validationMapping = {
  project: ProjectValidations,
  building: BuildingValidations,
};

export default class ModelFormComponent extends Component {
  get validations() {
    return validationMapping[this.args.model.modelName];
  }

  get isSaving() {
    return this.submit.isRunning;
  }

  @dropTask
  *submit(changeset) {
    yield changeset.validate();
    if (changeset.get("isValid")) {
      yield changeset.save();
      this.args.onSubmit.perform();
    }
  }
}
