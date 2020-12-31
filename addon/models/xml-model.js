import Handlebars from "handlebars";

export default class XMLModel {
  document;

  constructor(xmlOrDocument) {
    if (typeof xmlOrDocument === "string") {
      const parser = new DOMParser();
      this.document = parser.parseFromString(xmlOrDocument, "application/xml");
    } else {
      this.document = xmlOrDocument;
    }
  }

  getFieldFromXML(path, type = String) {
    const element = this.document.querySelector(path.replace(".", " "));
    if (element) {
      console.log(
        path,
        element.childElementCount ? element : element.textContent
      );
      return element.childElementCount ? element : type(element.textContent);
    }
    return null;
  }
}
