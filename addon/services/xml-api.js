import Service from "@ember/service";
import { partials, templates } from "ember-ebau-gwr/xml/templates";
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
    const modelName = model.constructor.name;

    // Compile the needed templates on the fly so only
    // the ones used are compiled to remove a bit of over head.
    if (!this.hbs.partials[modelName]) {
      this.hbs.registerPartial(modelName, this.hbs.compile(model.template));
    }

    if (!this.compiledTemplates[type]) {
      this.compiledTemplates[type] = compile(templates[type]);
    }

    return this.compiledTemplates[type](
      { modelName, model, reason },
      { allowProtoPropertiesByDefault: true }
    );
  }

  setupHandlebarsPartials() {
    Object.keys(partials).forEach((key) => {
      this.hbs.registerPartial(key, compile(partials[key]));
    });
  }
}
