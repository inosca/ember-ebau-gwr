import XMLModel from "./xml-model";

export default class SearchResult extends Array {
  /*
  * You need to pass in the xmlDocument wich contains the list
  * and specify the type of the elements via the `type` param.
  * The `field` is the name of the list elements in the xml since
  * this will probably not bee the model name.
  */
  constructor(xmlDocument, type, field) {
    super();
    const xmlModel = new XMLModel(xmlDocument);
    xmlModel.setFieldsFromXML({
      fields: {
        [field]: [type],
      },
    });
    this.push(...xmlModel[field]);
  }
}
