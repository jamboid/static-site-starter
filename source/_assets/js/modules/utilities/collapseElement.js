/**
 * collapseElement - Collapses an element by setting its height to 0.
 *
 * @param {DOMElement} element - A single DOM element
 */
export default function collapseElement(element) {
  // get the height of the element's inner content, regardless of its actual size
  const SECTION_HEIGHT = element.scrollHeight;
  element.style.height = SECTION_HEIGHT + "px";

  // temporarily disable all css transitions
  const ELEMENT_TRANSITION = element.style.transition;
  element.style.transition = '';

  // on the next frame (as soon as the previous style change has taken effect),
  // explicitly set the element's height to its current pixel height, so we
  // aren't transitioning out of 'auto'
  requestAnimationFrame(() => {
    element.style.height = SECTION_HEIGHT + 'px';
    element.style.transition = ELEMENT_TRANSITION;

    // on the next frame (as soon as the previous style change has taken effect),
    // have the element transition to height: 0
    requestAnimationFrame(() => {
      element.style.height = 0 + 'px';
    });
  });
}