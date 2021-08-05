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
      projectAnnouncementDate: "2019-12-11",
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

  async fetchBuildingsFromProject() {
    return [
      {
        kindOfWork: 6001,
        thermicSolarFacility: true,
        building: {
          buildingCategory: 1060,
          buildingStatus: 1004,
        },
      },
      {
        kindOfWork: 6002,
        energeticRestauration: true,
        building: {
          buildingCategory: 1030,
          buildingStatus: 1004,
        },
      },
      {
        kindOfWork: 6007,
        otherWorks: true,
        building: {
          buildingCategory: 1080,
          buildingStatus: 1007,
        },
      },
    ];
  }

  async fetchDwellingsFromBuilding() {
    return [
      {
        EDID: 0, // not sure if information can be given
        floor: 3100,
        dwellingStatus: 3001,
        dwellingUsage: {
          usageCode: 3010,
        },
      },
      {
        EDID: 0,
        floor: 3101,
        dwellingStatus: 3002,
        dwellingUsage: {
          usageCode: 3020,
        },
      },
      {
        EDID: 0,
        floor: 3102,
        dwellingStatus: 3003,
        dwellingUsage: {
          usageCode: 3030,
        },
      },
      {
        EDID: 0,
        floor: 3401,
        dwellingStatus: 3004,
        dwellingUsage: {
          usageCode: 3035,
        },
      },
      {
        EDID: 0,
        floor: 3402,
        dwellingStatus: 3007,
        dwellingUsage: {
          usageCode: 3036,
        },
      },
    ];
  }

  async fetchEntrancesFromBuilding() {
    return [
      {
        locality: {
          swissZipCode: 1234,
          name: {
            nameLong: "Place 0",
          },
        },
      },
      {
        locality: {
          swissZipCode: 5678,
          name: {
            nameLong: "Place 1",
          },
        },
      },
    ];
  }
}
