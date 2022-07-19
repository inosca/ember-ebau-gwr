import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { task } from "ember-concurrency";
import { trackedFunction } from "ember-resources/util/function";

export default class SurveyDepartmentErrors extends Component {
  @service quarterlyClosure;
  @service constructionProject;
  @service notification;
  @service intl;

  @tracked errors = trackedFunction(this, async () => {
    try {
      return await this.constructionProject.search({
        constructionSurveyDeptNumber:
          this.quarterlyClosure.constructionSurveyDeptNumber,
        hasError: true,
      });
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t("ember-gwr.quarterlyClosure.components.projectErrors.error")
      );
    }
  });

  @task
  *performQualityCheck(project) {
    try {
      return yield this.quarterlyClosure.checkConstructionProject(
        project.EPROID
      );
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t("ember-gwr.quarterlyClosure.components.projectErrors.error")
      );
    }
  }
}
