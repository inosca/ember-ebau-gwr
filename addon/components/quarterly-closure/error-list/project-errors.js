import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { task } from "ember-concurrency";
import { trackedFunction } from "reactiveweb/function";

export default class SurveyDepartmentErrors extends Component {
  @service quarterlyClosure;
  @service constructionProject;
  @service notification;
  @service intl;
  @service config;

  @tracked errors = trackedFunction(this, async () => {
    try {
      return await this.constructionProject.search({
        constructionSurveyDeptNumber:
          this.quarterlyClosure.constructionSurveyDeptNumber,
        hasError: true,
        sortColumn: this.config.quarterlyClosureSortColumn,
        sortDirection: this.config.quarterlyClosureSortDirection,
      });
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t(
          "ember-gwr.quarterlyClosure.components.projectErrors.error",
        ),
      );
    }
  });

  @task
  *performQualityCheck(project) {
    try {
      return yield this.quarterlyClosure.checkConstructionProject(
        project.EPROID,
      );
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t(
          "ember-gwr.quarterlyClosure.components.projectErrors.error",
        ),
      );
    }
  }
}
