import { modifier } from "ember-modifier";

export default modifier(function toggleModal(
  element,
  [visible = false] = [] /*, hash*/
) {
  const modalContainerClasses = document.getElementById(
    "ember-ebau-gwr-modal-container"
  ).classList;
  return visible
    ? modalContainerClasses.remove("uk-invisible")
    : modalContainerClasses.add("uk-invisible");
});
