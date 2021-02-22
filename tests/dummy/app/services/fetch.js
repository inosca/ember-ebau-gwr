import Service from "@ember/service";

export default class FetchService extends Service {
  async fetch() {
    return {
      json() {
        return {
          data: {
            constructionProjectDescription:
              "Donec mollis hendrerit risus. Fusce ac felis sit amet ligula pharetra condimentum.",
            typeOfConstruction: "Elektrizitätswerke",
            totalCostsOfProject: 10000,
            typeOfPermit: "Bewilligungsgrund 2",
            projectAnnouncementDate: "11.12.2019",
            client: {
              address: { street: "Gässli", houseNumber: 5 },
              identification: {
                personIdentification: {
                  officialName: "Müller",
                },
              },
            },
          },
        };
      },
    };
  }
}
