import Address, { Country } from "./models/address";
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
import DatePartiallyKnown from "./models/date-partially-known";
import Dwelling, { DwellingUsage } from "./models/dwelling";
import Identification from "./models/identification";
import Locality, { LocalityName } from "./models/locality";
import OrganisationIdentification, {
  LocalOrganisationId,
} from "./models/organisation-identification";
import PersonIdentification from "./models/person-identification";
import RealestateIdentification from "./models/realestate-identification";
import SearchResult from "./models/search-result";
import Street, { StreetDescription } from "./models/street";
import ThermotechnicalDeviceForHeating from "./models/thermotechnical-device-for-heating";
import ThermotechnicalDeviceForWarmWater from "./models/thermotechnical-device-for-warm-water";

export default {
  Coordinates,
  ConstructionProject,
  ConstructionProjectsList,
  Country,
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
  LocalityName,
  Street,
  StreetDescription,
  ThermotechnicalDeviceForHeating,
  ThermotechnicalDeviceForWarmWater,
  Dwelling,
  DwellingUsage,
  DatePartiallyKnown,
};
