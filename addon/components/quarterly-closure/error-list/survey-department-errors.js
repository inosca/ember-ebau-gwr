import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { trackedFunction } from "ember-resources/util/function";

export default class SurveyDepartmentErrors extends Component {
  @service quarterlyClosure;
  @service notification;
  @service intl;

  @tracked errors = trackedFunction(this, async () => {
    try {
      return await this.quarterlyClosure.checkQuarterlySurveyDept();
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t(
          "ember-gwr.quarterlyClosure.components.departmentErrors.error"
        )
      );
    }
  });
}
