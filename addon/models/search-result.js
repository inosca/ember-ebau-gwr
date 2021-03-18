import XMLModel from "./xml-model";

export default class SearchResult extends XMLModel {
  constructor(xml, listKey, ListModel) {
    super(xml);
    this.setFieldsFromXML({
      fields: {
        [listKey]: [ListModel],
      },
    });
  }
}
