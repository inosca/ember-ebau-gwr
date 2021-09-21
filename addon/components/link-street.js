import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import Street from "ember-ebau-gwr/models/street";

export default class LinkStreetComponent extends Component {
  Street = Street;

  @service config;
}
