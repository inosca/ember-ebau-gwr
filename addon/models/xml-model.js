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

    if (element.getAttribute("xsi:nil")) {
      return null;
    }

    if (element.children.length) {
      return new type(element);
    }

    if (type === Boolean) {
      return element.textContent === "true";
    }

    if (type === Date) {
      return new type(element.textContent);
    }

    return type(element.textContent);
  }

  getFieldFromXML(path, type, root) {
    const elements = this.document.querySelectorAll(
      root ? `${root} > ${path}` : path,
    );

    if (elements.length) {
      return Array.isArray(type)
        ? Array.from(elements).map((element) =>
            this.castToType(element, type[0]),
          )
        : this.castToType(elements[0], type);
    }

    return null;
  }

  /*
   * Takes an object with a fields property.
   *
   * `fields`: { [String]: Type | [Type] }
   *  Define the fields that should be read from the xml on initialization.
   *  If the type is an array, this means that there are multiple nodes in
   *  the response with this key name (alas a list of values).
   *  Examples
   *  { name:  String }
   *  { constructionProjectsList: [ConstructionProject] }
   */
  setFieldsFromXML(xmlDefinition) {
    // We do not execute this if the model is new since there exists no xml.
    if (!this.isNew) {
      // Automatically set the class name in camelCase as default.
      const { fields, root = null } = xmlDefinition;
      Object.entries(fields).forEach(([key, type]) => {
        // Do not reassign if the result is null || undefined.
        // We then want to keep the default structure.
        this[key] = this.getFieldFromXML(key, type, root) ?? this[key];
      });
    }
  }
}
