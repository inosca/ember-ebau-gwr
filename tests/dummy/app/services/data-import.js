import Service from "@ember/service";

export default class DataImport extends Service {
  async fetchProject() {
    return {
      constructionProjectDescription:
        "Donec mollis hendrerit risus. Fusce ac felis sit amet ligula pharetra condimentum.",
      typeOfConstructionProject: 6011,
      typeOfConstruction: 6213,
      totalCostsOfProject: 10000,
      typeOfPermit: 5001,
      projectAnnouncementDate: "11.12.2019",
      typeOfClient: 6101,
      client: {
        address: { street: "Gässli", houseNumber: 5 },
        identification: {
          organisationIdentification: {
            organisationAdditionalName: "Dev",
            localOrganisationId: {
              organisationId: "012.3456.7890",
              organisationIdCategory: "CH.ESTVID",
            },
          },
        },
      },
    };
  }
}
