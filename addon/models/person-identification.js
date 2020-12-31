import { tracked } from "@glimmer/tracking";

export default class PersonIdentification {
  @tracked officialName;
  @tracked firstName;
}
