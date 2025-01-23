import { modifier } from "ember-modifier";

// This modifiers allows to inverse a elment's color
// if the backgroundColor of the element and its parent match.
//
// This way we can for instance inverse the icon-button on striped
// tables.
// @inverse => Color
// @compareTo => CSSSelector
export default modifier(function inverseBackground(
  element,
  _,
  { inverse, compareTo },
) {
  const style = window.getComputedStyle(element);
  const parentElement = element.closest(compareTo);
  const parentStyle = window.getComputedStyle(parentElement);
  if (style.backgroundColor === parentStyle.backgroundColor) {
    element.style.backgroundColor = inverse;
  }
});
