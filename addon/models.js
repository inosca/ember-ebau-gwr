import Address from "./models/address";
import Building, { Volume } from "./models/building";
import BuildingEntrance from "./models/building-entrance";
import BuildingWork from "./models/building-work";
import BuildingsList from "./models/buildings-list";
import Client from "./models/client";
import ConstructionLocalisation from "./models/construction-localisation";
import ConstructionProject from "./models/construction-project";
import ConstructionProjectsList from "./models/construction-projects-list";
import Coordinates from "./models/coordinates";
import DateOfConstruction from "./models/date-of-construction";
import Identification from "./models/identification";
import Locality from "./models/locality";
import OrganisationIdentification, {
  LocalOrganisationId,
} from "./models/organisation-identification";
import PersonIdentification from "./models/person-identification";
import RealestateIdentification from "./models/realestate-identification";
import SearchResult from "./models/search-result";
import Street from "./models/street";

export default {
  Coordinates,
  ConstructionProject,
  ConstructionProjectsList,
  Building,
  Volume,
  BuildingsList,
  RealestateIdentification,
  Address,
  Client,
  ConstructionLocalisation,
  Identification,
  PersonIdentification,
  OrganisationIdentification,
  LocalOrganisationId,
  SearchResult,
  BuildingEntrance,
  BuildingWork,
  DateOfConstruction,
  Locality,
  Street,
};
