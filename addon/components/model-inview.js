import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { task } from "ember-concurrency";

export default class ModelInviewComponent extends Component {
  @tracked fetchedModel;

  @task
  *fetch(model) {
    this.fetchedModel = yield this.args.fetchModel(model);
  }
}
