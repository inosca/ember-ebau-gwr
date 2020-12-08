import Controller from "@ember/controller";

export default class LandingPageController extends Controller {
  get model() {
    return {
      realestateIdentification: {},
      client: { identification: { personIdentification: {} }, address: {} },
      isNew: true,
    };
  }
}
