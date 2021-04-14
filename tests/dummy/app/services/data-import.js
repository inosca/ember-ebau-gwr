import Service from "@ember/service";

export default class DataImport extends Service {
  async fetchProject() {
    return {
      constructionProjectDescription:
        "Donec mollis hendrerit risus. Fusce ac felis sit amet ligula pharetra condimentum.",
      typeOfConstruction: "Elektrizitätswerke",
      totalCostsOfProject: 10000,
      typeOfPermit: "Bewilligungsgrund 2",
      projectAnnouncementDate: "11.12.2019",
      client: {
        address: { street: "Gässli", houseNumber: 5 },
        identification: {
          organisationIdentification: {
            organisationName: "Adfinis AG",
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
