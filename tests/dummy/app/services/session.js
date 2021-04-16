import Service from "@ember/service";

export default class SessionService extends Service {
  data = { authenticated: { access_token: "Test" } };
}
