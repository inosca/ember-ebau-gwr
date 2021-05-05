import JSONAPIAdapter from "@ember-data/adapter/json-api";

export default class AppllicationAdapter extends JSONAPIAdapter {
  get headers() {
    return {
      Authorization: "Bearer Token",
    };
  }
}
