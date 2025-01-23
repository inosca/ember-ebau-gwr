import { later } from "@ember/runloop";
import Service, { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import CheckConstructionProjectResponse from "ember-ebau-gwr/models/check-construction-project-response";
import CheckSurveyDepartmentResponse from "ember-ebau-gwr/models/check-survey-department-response";
import QuarterlyClosureStatus, {
  STATUS_TYPES,
  REQUEST_PENDING,
} from "ember-ebau-gwr/models/quarterly-closure-status";

export default class QuarterlyClosureService extends Service {
  @service authFetch;
  @service intl;
  @service notification;

  @tracked quarterlyClosureStatus;

  get status() {
    const id = this.quarterlyClosureStatus?.surveyStatus;
    const status = {
      id,
      type: STATUS_TYPES[id],
    };

    if (id === REQUEST_PENDING) {
      return {
        type: REQUEST_PENDING,
        label: this.intl.t(`ember-gwr.quarterlyClosure.status.processing`),
        shortLabel: this.intl.t(
          `ember-gwr.quarterlyClosure.status.short.processing`,
        ),
      };
    }

    if (!id) {
      const label = this.intl.t(`ember-gwr.quarterlyClosure.status.loading`);
      return { ...status, label, shortLabel: label, isLoading: true };
    }

    return {
      ...status,
      label: this.intl.t(`ember-gwr.quarterlyClosure.status.${id}`),
      shortLabel: this.intl.t(`ember-gwr.quarterlyClosure.status.short.${id}`),
    };
  }

  get constructionSurveyDeptNumber() {
    return this.authFetch.constructionSurveyDeptNumber;
  }

  constructor(...args) {
    super(...args);
    this.pollProgressStatus();
  }

  async pollProgressStatus() {
    if (this.constructionSurveyDeptNumber) {
      try {
        this.quarterlyClosureStatus = await this.getProgressStatus();
        later(
          this,
          this.pollProgressStatus,
          this.status.type === REQUEST_PENDING
            ? 5000 //5sec
            : 1800000, // 30min
        );
      } catch (error) {
        console.error(error);
        this.notification.danger(
          this.intl.t("ember-gwr.quarterlyClosure.status.pollError"),
        );
        later(
          this,
          this.pollProgressStatus,
          60000, // 1min
        );
      }
    } else {
      // If the authFetch is not yet setup we just try again in 100ms
      later(this, this.pollProgressStatus, 100);
    }
  }

  async getProgressStatus() {
    if (!this.constructionSurveyDeptNumber) {
      return null;
    }

    const response = await this.authFetch.fetch(
      `/constructionsurveydepts/${this.constructionSurveyDeptNumber}/getProgressStatusQuarterlyClosure`,
      { method: "get" },
    );
    const quarterlyClosureStatus = new QuarterlyClosureStatus(
      await response.text(),
    );

    if (quarterlyClosureStatus.error?.length) {
      if (response.ok && quarterlyClosureStatus.error?.length) {
        const stillRunningStatus = new QuarterlyClosureStatus();
        stillRunningStatus.surveyStatus = REQUEST_PENDING;
        return stillRunningStatus;
      }
      const errors = quarterlyClosureStatus.error;
      throw errors;
    }

    return quarterlyClosureStatus;
  }

  async close() {
    if (!this.constructionSurveyDeptNumber) {
      return null;
    }

    await this.authFetch.fetch(
      `/constructionsurveydepts/${this.constructionSurveyDeptNumber}/closeQuarterlySurvey`,
      { method: "put" },
    );

    await this.pollProgressStatus();
  }

  async checkQuarterlySurveyDept() {
    if (!this.constructionSurveyDeptNumber) {
      return null;
    }

    const response = await this.authFetch.fetch(
      `/constructionsurveydepts/${this.constructionSurveyDeptNumber}/check`,
      { method: "put" },
    );
    return new CheckSurveyDepartmentResponse(await response.text());
  }

  async checkConstructionProject(id) {
    const response = await this.authFetch.fetch(
      `/constructionprojects/${id}/check`,
      { method: "put" },
    );
    return new CheckConstructionProjectResponse(await response.text());
  }
}
