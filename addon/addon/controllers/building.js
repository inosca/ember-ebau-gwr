import Controller from "@ember/controller";
import { tracked } from "@glimmer/tracking";

export default class BuildingController extends Controller {
  queryParams = ["projectId"];
  @tracked projectId = null;
}
