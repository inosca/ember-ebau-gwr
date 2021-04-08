import Service, { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { task, lastValue } from "ember-concurrency-decorators";

export default class AuthFetchService extends Service {
  @service config;
  @service intl;
  @service notification;

  @tracked showAuthModal = false;

  constructor(...args) {
    super(...args);
    this.housingStatToken.perform();
  }

  @lastValue("housingStatToken") token;
  @task
  *housingStatToken(username, password) {
    const response = yield fetch(`/api/v1/housing-stat-token`, {
      method: "post",
      headers: {
        "content-type": "application/json",
        // TODO Remove this is only for dev
        authorization: "Bearer jkdslfjlsd",
      },
      ...(username && password
        ? {
            body: JSON.stringify({
              username,
              password,
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

    return json.token;
  }

  async fetch(url, { method = "get", headers = {}, body } = {}) {
    if (this.housingStatToken.isRunning) {
      await this.housingStatToken.lastRunning;
    }
    return await fetch(`${this.config.gwrAPI}${url}`, {
      method,
      headers: {
        token: this.token,
        ...headers,
      },
      body,
    });
  }
}
