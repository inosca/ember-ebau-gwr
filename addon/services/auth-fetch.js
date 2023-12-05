import Service, { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { task, dropTask } from "ember-concurrency";

export default class AuthFetchService extends Service {
  @service config;
  @service intl;
  @service notification;
  @service session;

  @tracked showAuthModal = false;
  @tracked token;
  @tracked municipality;
  @tracked username;

  get constructionSurveyDeptNumber() {
    return this.municipality && `${this.municipality}00`;
  }

  constructor(...args) {
    super(...args);
    this.housingStatToken.perform();
  }

  showLogin() {
    this.showAuthModal = true;
    this.token = undefined;
    this.municipality = undefined;
  }

  @task
  *housingStatToken(username, password, municipality) {
    const response = yield fetch(`/api/v1/housing-stat-token`, {
      method: "post",
      headers: {
        "content-type": "application/json",
        authorization: yield this.session.getAuthorizationHeader(),
        "x-camac-group": this.config.camacGroup,
      },
      ...(username && password
        ? {
            body: JSON.stringify({
              username,
              password,
              municipality,
            }),
          }
        : {}),
    });

    const json = yield response.json();

    if (!response.ok) {
      if (json["400"]?.source === "internal") {
        this.showLogin();
      }

      if (json["401"]?.source === "external") {
        this.notification.danger(
          this.intl.t("ember-gwr.generalErrors.loginError"),
        );
        this.showLogin();
      }

      return;
    }

    this.token = json.token;
    this.municipality = json.municipality;
    this.username = json.username;
    return json;
  }

  @dropTask
  *clearHousingStatCredentials() {
    const response = yield fetch(`/api/v1/housing-stat-token/logout`, {
      method: "post",
      headers: {
        "content-type": "application/json",
        authorization: yield this.session.getAuthorizationHeader(),
        "x-camac-group": this.config.camacGroup,
      },
    });

    if (response.ok || (!response.ok && response.status === 401)) {
      this.showLogin();
    } else {
      this.notification.danger(
        this.intl.t("ember-gwr.generalErrors.logoutError"),
      );
    }
  }

  async fetch(url, { method = "get", headers = {}, body } = {}, retry = true) {
    if (this.housingStatToken.isRunning) {
      await this.housingStatToken.lastRunning;
    }

    if (this.token) {
      let response = await fetch(`${this.config.gwrAPI}${url}`, {
        method,
        headers: {
          token: this.token,
          "content-type": "application/xml",
          ...headers,
        },
        body,
      });
      if (!response.ok && response.status === 401 && !this.showAuthModal) {
        if (retry) {
          await this.housingStatToken.perform();
          response = await this.fetch(url, { method, headers, body }, false);
        }
      }
      return response;
    }

    this.showLogin();
  }
}
