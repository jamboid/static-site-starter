/**
 * expandElement - Expands an element with a height of 0 to its natural height by calculating this value.
 *
 * @param {DOMElement} element - A single DOM element
 */
export default function expandElement(element) {
  // get the height of the element's inner content, regardless of its actual size
  var SECTION_HEIGHT = element.scrollHeight;

  // have the element transition to the height of its inner content
  element.style.height = SECTION_HEIGHT + 'px';

  // when the next css transition finishes (which should be the one we just triggered)
  element.addEventListener('transitionend', function expansionEnds() {
    // remove this event listener so it only gets triggered once
    element.removeEventListener("transitionend", expansionEnds);
    // remove "height" from the element's inline styles, so it can return to its initial value
    element.style.height = null;
  });
}