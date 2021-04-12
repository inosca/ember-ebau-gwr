import JSONAPIAdapter from "@ember-data/adapter/json-api";

export default class AppllicationAdapter extends JSONAPIAdapter {
  headers = {
    authorization: "Bearer test",
  };
}
