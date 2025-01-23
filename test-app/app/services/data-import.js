import Service from "@ember/service";

export default class DataImport extends Service {
  async fetchProject() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      officialConstructionProjectFileNo: "0995-2019/03",
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

  async fetchBuildings() {
    // Theoretically we would have to ignore kindOfWork since this is defined on creation and linking.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return [
      {
        kindOfWork: 6001,
        thermicSolarFacility: true,
        building: {
          buildingCategory: 1060,
          buildingStatus: 1004,
          officialBuildingNo: 12220054,
          buildingClass: 1271,
          nameOfBuilding: "Stall",
        },
      },
      {
        kindOfWork: 6002,
        energeticRestauration: true,
        building: {
          buildingCategory: 1030,
          buildingStatus: 1004,
          officialBuildingNo: 300900,
          buildingClass: 1220,
          nameOfBuilding: "Haus",
        },
      },
      {
        kindOfWork: 6007,
        otherWorks: true,
        building: {
          buildingCategory: 1080,
          buildingStatus: 1007,
          officialBuildingNo: 65900,
          buildingClass: 1251,
          nameOfBuilding: "Schopf",
        },
      },
    ];
  }

  async fetchDwellings() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return [
      {
        EDID: 0, // not sure if information can be given
        floor: 3100,
        floorType: 3100,
        floorNumber: null,
        dwellingStatus: 3001,
        noOfHabitableRooms: 8,
        locationOfDwellingOnFloor: "Rechts",
        dwellingUsage: {
          usageCode: 3010,
        },
      },
      {
        EDID: 0,
        floor: 3101,
        floorType: 3101,
        floorNumber: 1,
        dwellingStatus: 3002,
        noOfHabitableRooms: 3,
        locationOfDwellingOnFloor: "Links",
        dwellingUsage: {
          usageCode: 3020,
        },
      },
      {
        EDID: 0,
        floor: 3102,
        floorType: 3101,
        floorNumber: 2,
        noOfHabitableRooms: 3,
        locationOfDwellingOnFloor: "Links",
        dwellingStatus: 3003,
        dwellingUsage: {
          usageCode: 3030,
        },
      },
      {
        EDID: 0,
        floor: null,
        floorType: null,
        floorNumber: null,
        noOfHabitableRooms: 3,
        locationOfDwellingOnFloor: "Links",
        dwellingStatus: 3004,
        dwellingUsage: {
          usageCode: 3035,
        },
      },
      {
        EDID: 0,
        floor: 3402,
        floorType: 3401,
        floorNumber: 2,
        noOfHabitableRooms: 2,
        locationOfDwellingOnFloor: "Rechts",
        dwellingStatus: 3007,
        dwellingUsage: {
          usageCode: 3036,
        },
      },
    ];
  }

  async fetchEntrances() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return [
      {
        buildingEntranceNo: "12c",
        locality: {
          swissZipCode: 1234,
          name: {
            nameLong: "Place 0",
          },
        },
      },
      {
        buildingEntranceNo: "1",
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
