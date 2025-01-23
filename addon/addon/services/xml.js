import Service from "@ember/service";
import Models from "ember-ebau-gwr/models";
import * as Helpers from "ember-ebau-gwr/xml/helpers";
import { Partials, Templates } from "ember-ebau-gwr/xml/templates";
import Handlebars, { compile } from "handlebars";

export default class XmlService extends Service {
  // XML Handling

  constructor(...args) {
    super(...args);
    this._setupHandlebarsPartials();
  }

  // This is required since HBS acts on a global Handlebars object
  _hbs = Handlebars;
  _compiledTemplates = {};

  buildXMLRequest(type, model, reason = "Update data") {
    // Compile the needed templates on the fly so only
    // the ones used are compiled to remove a bit of over head.
    if (!this._compiledTemplates[type]) {
      this._compiledTemplates[type] = compile(Templates[type]);
    }

    return this._compiledTemplates[type](
      { model, reason },
      { allowProtoPropertiesByDefault: true },
    );
  }

  _setupHandlebarsPartials() {
    Object.keys(Partials).forEach((key) => {
      this._hbs.registerPartial(key, compile(Partials[key]));
    });

    Object.keys(Models).forEach((key) => {
      const Model = Models[key];
      if (Model.template) {
        this._hbs.registerPartial(key, compile(Model.template));
      }
    });

    Object.keys(Helpers).forEach((key) => {
      this._hbs.registerHelper(key, Helpers[key]);
    });
  }
}
