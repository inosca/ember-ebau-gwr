import CurrentRouteIs from "./current-route-is";

export default class extends CurrentRouteIs {
  compute(...args) {
    return !super.compute(...args);
  }
}
