import { tracked } from "@glimmer/tracking";
import PersonIdentification from "./person-identification";

import XMLModel from "./xml-model";

export default class Identification extends XMLModel {
  @tracked personIdentification = new PersonIdentification();

  static template = `
  <identification>
    {{> PersonIdentification model=model.personIdentification}}
  </identification>
  `;
}
