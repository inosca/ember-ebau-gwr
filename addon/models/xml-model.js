export default class XMLModel {
  document;
  isNew = false;

  constructor(xmlOrObject) {
    // If no document is set then the model was created without arguments.
    // In this case we can assume the model to be new.
    if (!xmlOrObject) {
      this.isNew = true;
    } else {
      if (typeof xmlOrObject === "string") {
        const parser = new DOMParser();
        this.document = parser.parseFromString(xmlOrObject, "application/xml");
      } else if (xmlOrObject.querySelector) {
        this.document = xmlOrObject;
      }
    }
  }

  castToType(element, type) {
    // We dont want to instantiate the types Number or String with new.
    // This would cause problems with comparison.
    return element.children.length
      ? new type(element)
      : type(element.textContent);
  }

  getFieldFromXML(path, type) {
    const elements = this.document.querySelectorAll(path);

    if (elements.length) {
      return Array.isArray(type)
        ? Array.from(elements).map((element) =>
            this.castToType(element, type[0])
          )
        : this.castToType(elements[0], type);
    }

    return null;
  }

  /*
   * Takes an object with a fields and a namespace property.
   *
   * `fields`: { [String]: Type | [Type] }
   *  Define the fields that should be read from the xml on initialization.
   *  If the type is an array, this means that there are multiple nodes in
   *  the response with this key name (alas a list of values).
   *  Examples
   *  { name:  String }
   *  { constructionProjectsList: [ConstructionProject] }
   *
   *  `namespace`: String
   *  A Namespace for looking up xml fields. Most of the time this is just
   *  the model name in camel case.
   */
  setFieldsFromXML(xmlDefinition) {
    // We do not execute this if the model is new since there exists no xml.
    if (!this.isNew) {
      const { fields, namespace } = xmlDefinition;
      Object.entries(fields).forEach(([key, type]) => {
        this[key] = this.getFieldFromXML(
          // Testing if we even need the namespacing.
          // [...(namespace ? [namespace] : []), key].join(" "),
          key,
          type
        );
      });
    }
  }
}
