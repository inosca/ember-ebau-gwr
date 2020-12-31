import { tracked } from "@glimmer/tracking";
import PersonIdentification from "./person-identification";

export default class Identification {
  @tracked personIdentification = new PersonIdentification();
}
