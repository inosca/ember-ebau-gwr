import Service, { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { task } from "ember-concurrency-decorators";

export default class AuthFetchService extends Service {
  @service config;
  @service intl;
  @service notification;

  @tracked showAuthModal = false;

  constructor(...args) {
    super(...args);
    this.housingStatToken.perform();
  }

  get token() {
    return this.housingStatToken.lastSuccessful.value.token;
  }

  get municipality() {
    return this.housingStatToken.lastSuccessful.value.municipality;
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
          this.intl.t("ember-gwr.authentication.loginError")
        );
        this.showAuthModal = true;
      }
    }

    return json;
  }

  async fetch(url, { method = "get", headers = {}, body } = {}, retry = false) {
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
      if (!retry) {
        await this.housingStatToken.perform();
        response = await this.fetch(url, { method, headers, body }, true);
      }
    }
    return response;
  }
}
