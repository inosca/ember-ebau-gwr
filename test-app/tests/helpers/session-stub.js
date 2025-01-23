import Service from "@ember/service";

export default class SessionStub extends Service {
  async getAuthorizationHeader() {
    return "Bearer token";
  }
}
