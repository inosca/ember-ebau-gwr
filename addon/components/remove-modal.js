import { service } from "@ember/service";
import Component from "@glimmer/component";
import RemoveModalValidations from "ember-ebau-gwr/validations/remove-modal";

export default class RemoveModalComponent extends Component {
  RemoveModalValidations = RemoveModalValidations;

  @service config;
}
