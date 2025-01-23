import Service from "@ember/service";

export default class DataImportStub extends Service {
  async fetch() {
    return {
      json() {
        return {
          data: {
            constructionProjectDescription:
              "Donec mollis hendrerit risus. Fusce ac felis sit amet ligula pharetra condimentum.",
          },
        };
      },
    };
  }
}
