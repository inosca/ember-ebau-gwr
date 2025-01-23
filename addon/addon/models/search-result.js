import XMLModel from "./xml-model";

export default class SearchResult extends XMLModel {
  constructor(xml, fields = {}, root = "") {
    super(xml);
    this.setFieldsFromXML({
      // We set the root to empty since the search results have no real root
      // and XMLModel takes the model name with camelcase as default.
      root,
      fields,
    });
  }
}
