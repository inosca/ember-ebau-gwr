import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { getCurrentQuarter } from "ember-ebau-gwr/helpers/current-quarter";
import { trackedFunction } from "reactiveweb/function";

export default class SurveyDepartmentErrors extends Component {
  @service quarterlyClosure;
  @service notification;
  @service intl;

  get isFirstQuarter() {
    return getCurrentQuarter()?.quarter === 1;
  }

  @tracked errors = trackedFunction(this, async () => {
    try {
      return await this.quarterlyClosure.checkQuarterlySurveyDept();
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t(
          "ember-gwr.quarterlyClosure.components.departmentErrors.error",
        ),
      );
    }
  });
}
