export default class XMLModel {
  document;
  isNew = false;

  constructor(xmlOrObject) {
    // If no document is set then the model was created without arguments.
    // In this case we can assume the model to be new.
    if (!xmlOrObject) {
      this.isNew = true;
    } else if (typeof xmlOrObject === "string") {
      const parser = new DOMParser();
      this.document = parser.parseFromString(xmlOrObject, "application/xml");
    } else if (xmlOrObject.querySelector) {
      this.document = xmlOrObject;
    } else {
      // We assume its a object with some values and assign these to the model
      Object.entries(xmlOrObject).forEach(([key, value]) => {
        this[key] = value;
      });
    }

    if (!this.isNew) {
      this.setFieldsFromXML();
    }
  }

  getFieldFromXML(path, type = String) {
    const element = this.document.querySelector(path);
    if (element) {
      return element.childElementCount ? element : type(element.textContent);
    }
    return null;
  }

  setFieldsFromXML() {}
}
