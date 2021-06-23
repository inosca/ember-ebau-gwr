import { modifier } from "ember-modifier";

export default modifier(function ukSticky(
  element,
  [options = ""] = [] /*, hash*/
) {
  // Hacky until uikit allows attribute spread on the top level modal component
  // https://github.com/adfinis-sygroup/ember-uikit/pull/733
  element.parentElement.parentElement.setAttribute("uk-sticky", options);
});
