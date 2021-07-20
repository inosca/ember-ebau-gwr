import StatusBuildingChangeValidations from "./status/status-building-change";
import StatusBuildingCorrectionValidations from "./status/status-building-correction";
import StatusDwellingChangeValidations from "./status/status-dwelling-change";
import StatusDwellingCorrectionValidations from "./status/status-dwelling-correction";
import StatusProjectChangeValidations from "./status/status-project-change";
import StatusProjectCorrectionValidations from "./status/status-project-correction";

export function statusValidation(model, isChange) {
  switch (model) {
    case "project":
      return {
        ...(isChange
          ? StatusProjectChangeValidations
          : StatusProjectCorrectionValidations),
      };
    case "building":
      return {
        ...(isChange
          ? StatusBuildingChangeValidations
          : StatusBuildingCorrectionValidations),
      };

    case "dwelling":
      return {
        ...(isChange
          ? StatusDwellingChangeValidations
          : StatusDwellingCorrectionValidations),
      };
    default:
      throw Error("Status validation failed.");
  }
}
