/**
 * isElementInView - Check if an element is visible in the viewport and returns a boolean 
 * accordingly
 *
 * @param {object} element Description
 *
 * @returns {boolean} Description
 */
export default function isElementInView(element) {
  const WINDOW_HEIGHT = window.innerHeight;
  const SCROLL_TOP = window.scrollY;
  const ELEMENT_OFFSET = element.getBoundingClientRect();
  const ELEMENT_TOP = ELEMENT_OFFSET.top;
  const ELEMENT_HEIGHT = element.offsetHeight;

  if (ELEMENT_TOP < (SCROLL_TOP + WINDOW_HEIGHT) && (ELEMENT_TOP + ELEMENT_HEIGHT) > SCROLL_TOP) {
    return true;
  } else if ((ELEMENT_TOP + ELEMENT_HEIGHT) > SCROLL_TOP && (ELEMENT_TOP + ELEMENT_HEIGHT) < (SCROLL_TOP + WINDOW_HEIGHT)) {
    return true;
  } else {
    return false;
  }
}