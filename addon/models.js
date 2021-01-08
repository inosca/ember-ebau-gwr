import { tracked } from "@glimmer/tracking";

function constructor(data = {}) {
  Object.entries(data).forEach(([key, value]) => {
    this[key] = value;
  });
}

function serialize(fields = [], noJson = false) {
  const result = Object.assign(
    ...fields.map((field) => ({
      [field]:
        typeof this[field] === "object" &&
        typeof this[field]?.serialize === "function"
          ? this[field]?.serialize(true)
          : this[field],
    }))
  );
  return noJson ? result : JSON.stringify(result);
}

export class Model {
  constructor(...args) {
    constructor.apply(this, args);
  }
  serialize(noJson) {
    return serialize.call(this, this.fieldToSerialize, noJson);
  }
}

export class RealestateIdentification extends Model {
  fieldToSerialize = ["number", "egrid"];
  @tracked number;
  @tracked egrid;
}

export class PersonIdetification extends Model {
  fieldToSerialize = ["officialName", "firstName"];
  @tracked officialName;
  @tracked firstName;
}

export class Identification extends Model {
  fieldToSerialize = ["personIdentification"];
  @tracked personIdentification = new PersonIdetification();
}

export class Address extends Model {
  fieldToSerialize = [
    "street",
    "houseNumber",
    "swissZipCode",
    "town",
    "country",
  ];
  @tracked street;
  @tracked houseNumber;
  @tracked swissZipCode;
  @tracked town;
  @tracked country;
}

export class Client extends Model {
  fieldToSerialize = ["identification", "address"];
  @tracked identification = new Identification();
  @tracked address = new Address();
}

export class Project extends Model {
  fieldToSerialize = [
    "eprodid",
    "officialConstructionProjectFileNo",
    "extensionOfOfficialConstructionProjectFileNo",
    "typeOfClient",
    "typeOfConstruction",
    "typeOfConstructionProject",
    "typeOfPermit",
    "constructionLocalisation",
    "constructionProjectDescription",
    "totalCostsOfProject",
    "constructionSurveyDeptNo",
    "withdrawalDate",
    "projectStartDate",
    "constructionAuthorisationDeniedDate",
    "nonRealisationDate",
    "projectCompletionDate",
    "projectSuspensionDate",
    "buildingPermitIssueDate",
    "projectAnnouncementDate",
    "realestateIdentification",
    "client",
  ];
  @tracked eprodid;
  @tracked officialConstructionProjectFileNo;
  @tracked extensionOfOfficialConstructionProjectFileNo;

  @tracked typeOfClient;
  @tracked typeOfConstruction;
  @tracked typeOfConstructionProject;
  @tracked typeOfPermit;

  @tracked constructionLocalisation;
  @tracked constructionProjectDescription;
  @tracked totalCostsOfProject;
  @tracked constructionSurveyDeptNo;

  @tracked withdrawalDate;
  @tracked projectStartDate;
  @tracked constructionAuthorisationDeniedDate;
  @tracked nonRealisationDate;
  @tracked projectCompletionDate;
  @tracked projectSuspensionDate;
  @tracked buildingPermitIssueDate;
  @tracked projectAnnouncementDate;

  @tracked realestateIdentification = new RealestateIdentification();
  @tracked client = new Client();
}
