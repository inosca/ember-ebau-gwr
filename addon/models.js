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

export class RealestateIdentification {
  @tracked number;
  @tracked egrid;
  constructor(...args) {
    constructor.apply(this, args);
  }
  serialize(noJson) {
    return serialize.call(this, ["number", "egrid"], noJson);
  }
}

export class PersonIdetification {
  @tracked officialName;
  @tracked firstName;
  constructor(...args) {
    constructor.apply(this, args);
  }
  serialize(noJson) {
    return serialize.call(this, ["officialName", "firstName"], noJson);
  }
}

export class Identification {
  @tracked personIdentification = new PersonIdetification();
  constructor(...args) {
    constructor.apply(this, args);
  }
  serialize(noJson) {
    return serialize.call(this, ["personIdentification"], noJson);
  }
}

export class Address {
  @tracked street;
  @tracked houseNumber;
  @tracked swissZipCode;
  @tracked town;
  @tracked country;
  constructor(...args) {
    constructor.apply(this, args);
  }
  serialize(noJson) {
    return serialize.call(
      this,
      ["street", "houseNumber", "swissZipCode", "town", "country"],
      noJson
    );
  }
}

export class Client {
  @tracked identification = new Identification();
  @tracked address = new Address();
  constructor(...args) {
    constructor.apply(this, args);
  }
  serialize(noJson) {
    return serialize.call(this, ["identification", "address"], noJson);
  }
}

export class Project {
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
  constructor(...args) {
    constructor.apply(this, args);
  }
  serialize(noJson) {
    return serialize.call(
      this,
      [
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
      ],
      noJson
    );
  }
}
