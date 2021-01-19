import Service from "@ember/service";
import Models from "ember-ebau-gwr/models";
import * as Helpers from "ember-ebau-gwr/xml/helpers";
import { Partials, Templates } from "ember-ebau-gwr/xml/templates";
import Handlebars, { compile } from "handlebars";

export default class XMLApiService extends Service {
  // This is required since HBS acts on a global Handlebars object
  hbs = Handlebars;
  compiledTemplates = {};

  init(...args) {
    super.init(...args);
    this.setupHandlebarsPartials();
  }

  buildXMLRequest(type, model, reason = "Modification enregistrement") {
    // Compile the needed templates on the fly so only
    // the ones used are compiled to remove a bit of over head.
    if (!this.compiledTemplates[type]) {
      this.compiledTemplates[type] = compile(Templates[type]);
    }

    return this.compiledTemplates[type](
      { model, reason },
      { allowProtoPropertiesByDefault: true }
    );
  }

  setupHandlebarsPartials() {
    Object.keys(Partials).forEach((key) => {
      this.hbs.registerPartial(key, compile(Partials[key]));
    });

    Object.keys(Models).forEach((key) => {
      const Model = Models[key];
      if (Model.template) {
        this.hbs.registerPartial(key, compile(Model.template));
      }
    });

    Object.keys(Helpers).forEach((key) => {
      this.hbs.registerHelper(key, Helpers[key]);
    });
  }
}
