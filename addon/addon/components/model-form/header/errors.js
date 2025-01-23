import Component from "@glimmer/component";

export default class ModelFormHeaderErrorsComponent extends Component {
  get errorCount() {
    return this.args.model?.errorList?.length ?? 0;
  }
}
