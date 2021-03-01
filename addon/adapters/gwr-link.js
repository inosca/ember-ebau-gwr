import JSONAPIAdapter from "@ember-data/adapter/json-api";

export default class GwrLinkAdapter extends JSONAPIAdapter {
  namespace = "api/v1/linker";
}
