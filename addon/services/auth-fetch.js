import Service, { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { task, dropTask } from "ember-concurrency-decorators";

export default class AuthFetchService extends Service {
  @service config;
  @service intl;
  @service notification;

  @tracked showAuthModal = false;
  @tracked token;
  @tracked municipality;

  constructor(...args) {
    super(...args);
    this.housingStatToken.perform();
  }

  @task
  *housingStatToken(username, password, municipality) {
    if (
      this.config.username &&
      this.config.password &&
      this.config.municipality
    ) {
      ({ username, password, municipality } = this.config);
    }
    const response = yield fetch(`/api/v1/housing-stat-token`, {
      method: "post",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${this.config.authToken}`,
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
        this.showAuthModal = true;
      }

      if (json["401"]?.source === "external") {
        this.notification.danger(
          this.intl.t("ember-gwr.generalErrors.loginError")
        );
        this.showAuthModal = true;
      }
    }

    this.token = json.token;
    this.municipality = json.municipality;
    return json;
  }

  @dropTask
  *clearHousingStatCredentials() {
    const response = yield fetch(`/api/v1/housing-stat-token/logout`, {
      method: "post",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${this.config.authToken}`,
        "x-camac-group": this.config.camacGroup,
      },
    });

    if (response.ok) {
      this.showAuthModal = true;
      this.token = undefined;
      this.municipality = undefined;
    } else {
      this.notification.danger(
        this.intl.t("ember-gwr.generalErrors.logoutError")
      );
    }
  }

  async fetch(url, { method = "get", headers = {}, body } = {}, retry = true) {
    if (this.housingStatToken.isRunning) {
      await this.housingStatToken.lastRunning;
    }
    let response = await fetch(`${this.config.gwrAPI}${url}`, {
      method,
      headers: {
        token: this.token,
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
}
