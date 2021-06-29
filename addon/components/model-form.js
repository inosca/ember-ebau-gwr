import Component from "@glimmer/component";
import { dropTask } from "ember-concurrency-decorators";

export default class ModelFormComponent extends Component {
  get isSaving() {
    return this.submit.isRunning || this.args.onSubmit.isRunning;
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
