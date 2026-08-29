import { library, config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import {
  faFolderClosed,
  faBuilding,
} from "@fortawesome/free-regular-svg-icons";
import {
  faListCheck,
  faTriangleExclamation,
  faArrowsRotate,
  faCircleCheck,
  faClock,
  faCircleInfo,
  faCircleExclamation,
  faEye,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

config.autoAddCss = false;

library.add(
  faFolderClosed,
  faBuilding,
  faListCheck,
  faTriangleExclamation,
  faArrowsRotate,
  faCircleCheck,
  faClock,
  faCircleInfo,
  faCircleExclamation,
  faEye,
  faXmark,
);
