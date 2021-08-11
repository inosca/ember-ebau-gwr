import Service from "@ember/service";

export default class SessionService extends Service {
  async getAuthorizationHeader() {
    return "Bearer token";
  }
}
