import { tracked } from "@glimmer/tracking";
import ConstructionProjectsList from "ember-ebau-gwr/models/construction-projects-list";

import XMLModel from "./xml-model";

export default class SearchResult extends XMLModel {
  @tracked constructionProjectsList;

  constructor(...args) {
    super(...args);
    this.setFieldsFromXML({
      fields: {
        constructionProjectsList: [ConstructionProjectsList],
      },
    });
  }
}
